import path from 'path';
import { spawn } from 'child_process';
import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';
import nodeFetch from 'node-fetch';
import BaseComponent from './common/base';
import logger from './common/logger';
import { getJwtoken, getUploadUrl } from './common/jwt-token';
import { ICredentials, InputProps } from './common/entity';
import { createProject, verifyProject, updateProject } from './common/request';
// import i18n from './common/i18n';

const Host = 's.devsapp.cn';
const CONTENT_TYPE_MAP = {
  html: 'text/html; charset=UTF-8',
  htm: 'text/html; charset=UTF-8',
  text: 'text/plain; charset=UTF-8',
  txt: 'text/plain; charset=UTF-8',
  xml: 'text/xml; charset=UTF-8',
  rss: 'application/rss+xml; charset=UTF-8',
  atom: 'application/atom+xml; charset=UTF-8',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  ico: 'image/x-icon',
  png: 'image/png',
  svg: 'image/svg+xml; charset=UTF-8',
  xhtml: 'application/xhtml+xml; charset=UTF-8',
  json: 'application/json; charset=UTF-8',
  yaml: 'application/x-yaml; charset=UTF-8',
  map: 'application/json; charset=UTF-8',
  pdf: 'application/pdf; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css; charset=UTF-8',
  md: 'text/markdown; charset=UTF-8',
  wasm: 'application/wasm',
  zip: 'application/x-zip',
  mp3: 'audio/mpeg',
  ogg: 'video/ogg',
  mp4: 'video/mp4',
};
const MAX_FILE_SIZE = 10485760;
const CACHE_RULE_REGEXP = new RegExp('[\\-._a-f\\d][a-f\\d]{8}.(js|css|woff|woff2|jpg|jpeg|png|svg)$');
const CACHED_PATHS = ['/_nuxt/', '/_snowpack/', '/51cache/'];
const CACHED_FILE_NAME_MIN_LEN = 19;

/**
 * 验证文件是否能被浏览器端缓存
 * @param absoluteFilePath 文件的绝对路径，需要以'/'开头，路径中包含文件名
 * @return  可以被缓存标识
 */
function isLegalCacheFile(absoluteFilePath: string): boolean {
  let fileName = path.posix.basename(absoluteFilePath);
  if (CACHED_PATHS.find((whitePath) => absoluteFilePath.indexOf(whitePath) >= 0)) {
    return true;
  }
  if (fileName.length >= CACHED_FILE_NAME_MIN_LEN) {
    return CACHE_RULE_REGEXP.test(fileName);
  }
  return false;
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default class ComponentDemo extends BaseComponent {
  protected ignoreFiles = [];

  constructor(props) {
    super(props);
    const signorePath = path.join(process.cwd(), '.signore');
    if (fs.existsSync(signorePath)) {
      const signoreContent = fs.readFileSync(signorePath, 'utf-8');
      this.ignoreFiles = signoreContent.split('\n');
    }
  }

  private setEnv(credentials: ICredentials) {
    process.env.accessKey = credentials.AccessKeyID;
    process.env.accessSecret = credentials.AccessKeySecret;
  }

  // private trim(str) {
  //   return str.replace(/(^\s*)|(\s*$)/g, "");
  // }
  // private replaceFun(str, obj) {
  //   const reg = /\{\{(.*?)\}\}/g;
  //   let arr = str.match(reg);
  //   if (arr) {
  //     for (let i = 0; i < arr.length; i++) {
  //       let keyContent = arr[i].replace(/{{|}}/g, '');
  //       let realKey = this.trim(keyContent.split('|')[0]);
  //       if (obj[realKey]) {
  //         str = str.replace(arr[i], obj[realKey]);
  //       }
  //     }
  //   }

  //   return str;
  // }

  private async travel(dir, callback) {
    fs.readdir(dir, (err, files) => {
      if (err) {
        logger.error(err);
      } else {
        files.forEach((file) => {
          const pathname = path.join(dir, file);
          fs.stat(pathname, async (err, stats) => {
            if (err) {
              logger.error(err);
            } else if (stats.isDirectory()) {
              await this.travel(pathname, callback);
            } else {
              await callback(pathname);
            }
          });
        });
      }
    });
  }

  private travelAsync(dir, filesArr = []) {
    const folders = fs.readdirSync(dir);
    folders.forEach((file) => {
      if (!this.ignoreFiles.includes(file)) {
        const pathname = path.join(dir, file);
        if (fs.statSync(pathname).isDirectory()) {
          return this.travelAsync(pathname, filesArr);
        } else {
          filesArr.push(pathname);
        }
      }
    });
    return filesArr;
  }

  private async uploadFiles(filePath, payload, sourceFolder?) {
    let _shortName: string = payload.fileName;
    if (!payload.fileName) {
      if (process.platform === 'win32') {
        let tmpFilePath = filePath.replace(/\\/g, '/');
        _shortName = tmpFilePath.replace(sourceFolder + '/', '');
      } else {
        _shortName = filePath.replace(sourceFolder + '/', '');
      }

      payload.fileName = _shortName;
    }
    // ignore the hidden file that start with '.'
    if (path.posix.basename(filePath).startsWith('.')) {
      logger.fatal(`${_shortName.padEnd(71)} Ignored`);
      return;
    }
    const contentType = CONTENT_TYPE_MAP[path.extname(filePath).substr(1)] || 'text/plain; charset=UTF-8';
    const uploadUrl = getUploadUrl(payload);
    try {
      const fileState = fs.statSync(filePath);
      if (fileState.size <= MAX_FILE_SIZE) {
        let headers = {
          Host,
          'Content-Type': contentType,
          Authorization: `bear ${getJwtoken(payload)}`,
        };
        const cachedFile = isLegalCacheFile('/' + payload.fileName);
        if (cachedFile) {
          headers['Cache-Control'] = 'public, max-age=31536000';
        }
        // hint, such as cached, optimize file size
        let hint = cachedFile ? 'Cached ' : '';
        if (fileState.size >= 2097152) {
          // file size more than 2 MB
          hint = hint + 'Optimize file size';
        }
        const stream = fs.createReadStream(filePath);
        const res = await nodeFetch(uploadUrl, {
          method: 'POST',
          body: stream,
          timeout: 25000,
          headers: headers,
        });
        if (res.status === 200) {
          console.log(`${_shortName.padEnd(60)} ${formatBytes(fileState.size).padStart(10)} Succeeded ${hint}`);
        } else {
          logger.fatal(`${_shortName.padEnd(60)} ${formatBytes(fileState.size).padStart(10)} Failed`);
        }
      } else {
        logger.fatal(`${_shortName.padEnd(60)} ${formatBytes(fileState.size).padStart(10)} Failed    Over 10M `);
      }
    } catch (e) {
      logger.fatal(`${_shortName.padEnd(71)} Failed    ${e.message}`);
    }
  }

  /**
   * update project metadata and upload the files
   */
  private async updateProjectInfo({ apps, project, domain, favicon, defaultApp }) {
    const copyApps = _.cloneDeepWith(apps);
    apps.forEach((app) => {
      app.sourceCode && delete app.sourceCode;
      app.releaseCode && delete app.releaseCode;
    });
    const updatePayload = {
      domain,
      project,
      projectInfo: {
        id: project,
        domain,
        favicon,
        defaultApp,
        apps,
      },
    };
    // upload the files first
    await this.checkAndUploadFiles({
      apps: copyApps,
      domain,
    });
    // update project metadata
    const updateResult = await updateProject(updatePayload);
    if (updateResult.success) {
      logger.info(`Succeed to update project metadata`);
      //todo delete the stale files
    } else {
      logger.error(`Failed to update project metadata`);
    }
  }

  private async exeBuildWebStaticCmd(_path: string, appName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(path.join(_path, 'package.json'))) {
        const buildCmd = spawn('npm', ['run', 'build'], {
          shell: true,
          cwd: _path,
          stdio: 'inherit',
        });
        buildCmd.on('close', (code) => {
          logger.success(`【${appName}】 execute build successfully`);
          resolve({ code });
        });
      } else {
        resolve({});
      }
    });
  }

  private async checkAndUploadFiles({ apps, domain }) {
    const allAppFunction = [];
    apps.forEach((item, i) => {
      const promiseFunction = new Promise(async (resolve, reject) => {
        try {
          const appName = item.name;
          const sourceCode = item.sourceCode; // 源码文件，需要构建
          const releaseCode = item.releaseCode; // 构建好的静态文件
          if (fs.existsSync(sourceCode)) {
            await this.exeBuildWebStaticCmd(sourceCode, appName);
            let statisFilesName = ['build', 'dist', 'release'];
            let staicsFilesPath = '';
            statisFilesName.forEach((fileName) => {
              const staticReleasePath = path.join(sourceCode, fileName);
              if (fs.existsSync(staticReleasePath)) {
                staicsFilesPath = staticReleasePath;
              }
            });
            if (fs.existsSync(staicsFilesPath)) {
              const files = this.travelAsync(staicsFilesPath);
              const promiseArr = [];
              files.forEach((fileName) => {
                promiseArr.push(
                  new Promise(async (resolve, reject) => {
                    await this.uploadFiles(fileName, { domain, appName }, staicsFilesPath);
                    resolve('');
                  }),
                );
              });
              await Promise.all(promiseArr);
              logger.info(`-----【${appName}】 upload completed ----- \n\n`);
              resolve(i);
            }
          } else if (fs.existsSync(releaseCode)) {
            // 如果有直接指定静态文件直接进行上传
            logger.info(`Begin to upload the files for app: ${appName}`);
            const files = this.travelAsync(releaseCode);
            if (files.length <= 10000) {
              //文件数超过10000
              const promiseArr = [];
              files.forEach((fileName) => {
                promiseArr.push(
                  new Promise(async (resolve, reject) => {
                    await this.uploadFiles(fileName, { domain, appName }, releaseCode);
                    resolve('');
                  }),
                );
              });
              await Promise.all(promiseArr);
              logger.info(`Succeed to upload the files for app: ${appName}`);
            } else {
              logger.error(`Failed to upload files for ${appName}: the files number ${files.length} more than 10000`);
            }
            resolve(i);
          } else {
            resolve(i);
          }
        } catch (e) {
          reject(e);
        }
      });
      allAppFunction.push(promiseFunction);
    });
    return await Promise.all(allAppFunction);
  }

  public async deploy(inputs: InputProps) {
    process.env.dryRun = (inputs.args.indexOf('--dry-run') >= 0).toString();
    const { domain, apps, defaultApp, favicon } = inputs.props;
    try {
      const credentials = inputs.credentials;
      this.setEnv(credentials);
      const verifyResult = await verifyProject(domain);
      if (!verifyResult.success) {
        // domain owned by other developer
        throw Error(verifyResult.msg);
      } else {
        if (verifyResult.data && verifyResult.data.project) {
          // project already created by you
          const projectInfo = verifyResult.data.project;
          await this.updateProjectInfo({
            apps,
            project: projectInfo.id,
            domain,
            favicon,
            defaultApp,
          });
        } else {
          // you can create project with this domain
          const result = await createProject(domain);
          if (result.success) {
            logger.info(`Succeed to create the project`);
            const project = result.data.id;
            await new Promise(async (resolve, reject) => {
              setTimeout(async () => {
                await this.updateProjectInfo({
                  apps,
                  project,
                  domain,
                  favicon,
                  defaultApp,
                });
                resolve('');
              }, 4000);
            });
          } else {
            throw Error(result.msg);
          }
        }
      }
      const result_domain = `https://${domain}`;
      const successInfo = [`部署成功! 访问域名: ${result_domain}`, '部署信息：', yaml.dump(inputs.props)].join('\n');
      super.__report({
        name: 'domain',
        content: {
          domain: result_domain,
          weight: 3,
        },
      });

      return successInfo;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
