import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import { execSync } from 'child_process';
import _ from 'lodash';
import mime from 'mime';
import hasha from 'hasha';
import nodeFetch from 'node-fetch';
import BaseComponent from './common/base';
import logger from './common/logger';
import { getJwtoken, getUploadUrl } from './common/jwt-token';
import { ICredentials, InputProps } from './common/entity';
import { createProject, verifyProject, updateProject, listAppFiles } from './common/request';
// import i18n from './common/i18n';

const Host = 's.devsapp.cn';

// reset some mime types
mime.define({ 'text/html; charset=UTF-8': ['html', 'htm'] }, true);
mime.define({ 'application/xhtml+xml; charset=UTF-8': ['xhtml', 'htm'] }, true);
mime.define({ 'text/plain; charset=UTF-8': ['text', 'txt'] }, true);
mime.define({ 'text/xml; charset=UTF-8': ['xml'] }, true);
mime.define({ 'application/rss+xml; charset=UTF-8': ['rss'] }, true);
mime.define({ 'application/atom+xml; charset=UTF-8': ['atom'] }, true);
mime.define({ 'image/svg+xml; charset=UTF-8': ['svg'] }, true);
mime.define({ 'application/json; charset=UTF-8': ['json'] }, true);
mime.define({ 'application/x-yaml; charset=UTF-8': ['yaml'] }, true);
mime.define({ 'application/javascript; charset=UTF-8': ['js'] }, true);
mime.define({ 'text/css; charset=UTF-8': ['css'] }, true);
mime.define({ 'text/markdown; charset=UTF-8': ['md'] }, true);
mime.define({ 'text/avro': ['avsc'] }, true);
mime.define({ 'text/proto': ['proto'] }, true);

const MAX_FILE_SIZE = 10485760;
const CACHE_RULE_REGEXP = new RegExp('[\\-._a-f\\d][a-f\\d]{8}.[a-z\\d]{3,}$');
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

function getFileObjectKey(filePath: string, sourceFolder: string): string {
  let fileObjectKey: string;
  if (process.platform === 'win32') {
    let tmpFilePath = filePath.replace(/\\/g, '/');
    fileObjectKey = tmpFilePath.replace(sourceFolder + '/', '');
  } else {
    fileObjectKey = filePath.replace(sourceFolder + '/', '');
  }
  return fileObjectKey;
}

function getFileContentType(filePath: string) {
  return mime.getType(filePath) || 'application/octet-stream';
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

  private async uploadFile(filePath, payload, sourceFolder?) {
    let _shortName: string = payload.fileName;
    if (!payload.fileName) {
      _shortName = getFileObjectKey(filePath, sourceFolder);
      payload.fileName = _shortName;
    }
    // ignore the hidden file that start with '.'
    if (path.posix.basename(filePath).startsWith('.')) {
      logger.fatal(`${_shortName.padEnd(71)} Ignored   Hidden file`);
      return;
    }
    let fileMetadata: { etag: string; size: number } = null;
    if (payload.uploadFiles && payload.uploadFiles[_shortName]) {
      fileMetadata = payload.uploadFiles[_shortName];
    }
    const contentType = getFileContentType(filePath);
    const uploadUrl = getUploadUrl(payload);
    try {
      let fileSize: number;
      if (fileMetadata) {
        fileSize = fileMetadata.size;
      } else {
        fileSize = fs.statSync(filePath).size;
      }
      if (fileSize == 0) {
        // empty file
        logger.fatal(`${_shortName.padEnd(60)} ${formatBytes(fileSize).padStart(10)} Ignored   Empty file`);
        return;
      }
      if (fileSize <= MAX_FILE_SIZE) {
        // compare etag and skip file upload or not
        let uploadSkip = false;
        if (!(process.env.forceUpload === 'true')) {
          if (payload.remoteFiles && payload.remoteFiles[_shortName]) {
            const remoteEtag = payload.remoteFiles[_shortName];
            let localEtag;
            if (fileMetadata) {
              localEtag = fileMetadata.etag;
            } else {
              localEtag = await hasha.fromFile(filePath, { algorithm: 'md5' });
            }
            if (localEtag && (remoteEtag === localEtag || remoteEtag === localEtag.toUpperCase())) {
              uploadSkip = true;
            }
          }
        }
        const cachedFile = isLegalCacheFile('/' + payload.fileName);
        // hint, such as cached, optimize file size
        let hint = cachedFile ? 'Cached ' : '';
        if (fileSize >= 2097152) {
          // file size more than 2 MB
          hint = hint + 'Optimize file size';
        }
        if (!uploadSkip) {
          // 文件有修改，需要重新上传
          let headers = {
            Host,
            'Content-Type': contentType,
            Authorization: `bear ${getJwtoken(payload)}`,
          };
          if (cachedFile) {
            headers['Cache-Control'] = 'public, max-age=31536000';
          }
          let res;
          if (process.env.dryRun === 'true') {
            res = { status: 200 };
          } else {
            const stream = fs.createReadStream(filePath);
            res = await nodeFetch(uploadUrl, {
              method: 'POST',
              body: stream,
              timeout: 25000,
              headers: headers,
            });
          }
          if (res.status === 200) {
            console.log(`${_shortName.padEnd(60)} ${formatBytes(fileSize).padStart(10)} Succeeded ${hint}`);
          } else {
            // 文件上传失败
            logger.fatal(`${_shortName.padEnd(60)} ${formatBytes(fileSize).padStart(10)} Failed    Upload Failure`);
          }
        } else {
          // 文件没有任何修改
          console.log(`${_shortName.padEnd(60)} ${formatBytes(fileSize).padStart(10)} Skipped   No local change ${hint}`);
        }
      } else {
        // 文件大于10M
        logger.fatal(`${_shortName.padEnd(60)} ${formatBytes(fileSize).padStart(10)} Ignored   Over 10M `);
      }
    } catch (e) {
      // 文件上传过程的任何错误
      logger.fatal(`${_shortName.padEnd(71)} Failed    ${e.message}`);
    }
  }

  /**
   * update project metadata and upload the files
   */
  private async updateProjectInfo({ apps, project, domain, favicon, defaultApp }) {
    const copyApps = _.cloneDeepWith(apps);
    apps.forEach((app) => {
      app.buildCmd && delete app.buildCmd;
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
    let updateResult;
    if (process.env.dryRun === 'true') {
      updateResult = { success: true };
    } else {
      updateResult = await updateProject(updatePayload);
    }
    if (updateResult.success) {
      logger.info(`Succeed to update project metadata`);
      //todo delete the stale files
    } else {
      logger.error(`Failed to update project metadata`);
    }
  }

  private async checkAndUploadFiles({ apps, domain }) {
    const allAppFunction = [];
    apps.forEach((item, i) => {
      const promiseFunction = new Promise(async (resolve, reject) => {
        try {
          const appName = item.name;
          const buildCmd = item.buildCmd; // 应用构建命令
          const releaseCode = item.releaseCode; // 构建好的静态文件
          if (buildCmd) {
            // 执行应用的构建
            logger.info(`Begin to build the app: ${appName}`);
            try {
              execSync(buildCmd, { stdio: 'inherit' });
            } catch (e) {
              logger.fatal(e.message);
              process.exit(1);
            }
          }
          if (fs.existsSync(releaseCode)) {
            // 如果有直接指定静态文件直接进行上传
            logger.info(`Begin to upload the files for app: ${appName}`);
            const files = this.travelAsync(releaseCode);
            if (files.length <= 10000) {
              //生成 _files 文件，用于统计最后一次上传的文件列表
              const staticsFile = path.normalize(`${releaseCode}/_files`);
              let uploadFiles = (
                await Promise.all(
                  files
                    .filter((filePath: string) => {
                      return !path.posix.basename(filePath).startsWith('.');
                    })
                    .map((filePath: string) => {
                      const fileState = fs.statSync(filePath);
                      return hasha.fromFile(filePath, { algorithm: 'md5' }).then((fileHash) => {
                        return [getFileObjectKey(filePath, releaseCode), fileHash, fileState.size];
                      });
                    }),
                )
              ).reduce(function (map, arr) {
                const fileSize = arr[2] as number;
                if (fileSize > 0 && fileSize <= MAX_FILE_SIZE) {
                  map[arr[0]] = { etag: arr[1], size: arr[2], key: arr[0] };
                }
                return map;
              }, {});
              const totalFilesSize = Object.values(uploadFiles).reduce(function (total: number, obj: any) {
                return total + obj.size;
              }, 0);
              fs.writeFileSync(
                staticsFile,
                JSON.stringify({
                  domain: domain,
                  app: appName,
                  totalFilesSize: totalFilesSize,
                  timestamp: Date.now(),
                  objectMetadataList: Object.values(uploadFiles),
                }),
              );
              if (!files.includes(staticsFile)) {
                files.push(staticsFile);
              }
              // fetch remote files
              const remoteObjects = await listAppFiles(domain, appName);
              const remoteFiles = remoteObjects.objectMetadataList.reduce(function (map, obj) {
                map[obj.key] = obj.etag;
                return map;
              }, {});
              // 上传文件
              const promiseArr = [];
              files.forEach((fileName: string) => {
                promiseArr.push(
                  new Promise(async (resolve, reject) => {
                    await this.uploadFile(fileName, { domain, appName, remoteFiles, uploadFiles }, releaseCode);
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
    process.env.forceUpload = (inputs.args.indexOf('--force-upload') >= 0).toString();
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
      const successInfo = [`Succeed to deploy, and website url: ${result_domain}`, ' Deployment info：', yaml.dump(inputs.props)].join('\n');
      super.__report({
        name: 'domain',
        content: {
          domain: result_domain,
          weight: 3,
        },
      });
      if (process.env.dryRun === 'true') {
        logger.fatal('Running on dry run mode, no any change to upload!');
      }
      return successInfo;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
