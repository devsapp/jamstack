import path from 'path';
import { spawn } from 'child_process';
import yaml from 'js-yaml';
import fs from 'fs';
import _ from 'lodash';
import nodeFetch from 'node-fetch';
import BaseComponent from './common/base';
import logger from './common/logger';
import { getJwtoken, getUploadUrl } from './common/jwt-token';
import { InputProps, ICredentials, } from './common/entity';
import { createProject, updateProject, getProjectInfo } from './common/request';
const Host = 's.devsapp.cn';
const CONTENT_TYPE_MAP = {
  'html': 'text/html; charset=UTF-8',
  'text': 'text/plain; charset=UTF-8',
  'xml': 'text/xml; charset=UTF-8',
  'gif': 'image/gif; charset=UTF-8',
  'jpg': 'image/jpeg; charset=UTF-8',
  'jpeg': 'image/jpeg; charset=UTF-8',
  'png': 'image/png; charset=UTF-8',
  'svg': 'image/svg+xml; charset=UTF-8',
  'xhtml': 'application/xhtml+xml; charset=UTF-8',
  'json': 'application/json; charset=UTF-8',
  'pdf': 'application/pdf; charset=UTF-8',
  'js': 'application/javascript; charset=UTF-8',
  'css': 'text/css; charset=UTF-8'
}
const MAX_FILE_SIZE = 10485760;
export default class ComponentDemo extends BaseComponent {
  constructor(props) {
    super(props)
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
        logger.error(err)
      } else {
        files.forEach((file) => {
          const pathname = path.join(dir, file)
          fs.stat(pathname, async (err, stats) => {
            if (err) {
              logger.error(err)
            } else if (stats.isDirectory()) {
              await this.travel(pathname, callback)
            } else {
              await callback(pathname)
            }
          })
        })
      }
    })
  }


  private travelAsync(dir, filesArr = []) {
    const folders = fs.readdirSync(dir);
    folders.forEach((file) => {
      const pathname = path.join(dir, file)
      if (fs.statSync(pathname).isDirectory()) {
        return this.travelAsync(pathname, filesArr);
      } else {
        filesArr.push(pathname);
      }
    })
    return filesArr;
  }

  private async uploadFiles(filePath, payload, sourceFolder?) {
    let _shortName = payload.fileName;
    if (!payload.fileName) {
      if (process.platform === 'win32') {
        let tmpFilePath = filePath.replace(/\\/g, '/');
        _shortName = tmpFilePath.replace(sourceFolder + '/', '');
      } else {
        _shortName = filePath.replace(sourceFolder + '/', '');
      }

      payload.fileName = _shortName;
    }
    const contentType = CONTENT_TYPE_MAP[path.extname(filePath).substr(1)] || 'text/plain; charset=UTF-8';
    const uploadUrl = getUploadUrl(payload);
    try {
      const fileState = fs.statSync(filePath);
      if (fileState.size <= MAX_FILE_SIZE) {
        const stream = fs.createReadStream(filePath);
        const res = await nodeFetch(uploadUrl, {
          method: 'POST',
          body: stream,
          timeout: 25000,
          headers: {
            Host,
            'Content-Type': contentType,
            'Authorization': `bear ${getJwtoken(payload)}`,
          },
        });
        if (res.status === 200) {
          logger.info(`${_shortName} file upload success`);
        } else {
          logger.error(`${_shortName} file upload error`);
        }
      } else {
        logger.error(`${_shortName} files over 10M cannot be uploaded`);
      }
    } catch (e) {
      logger.error(`${_shortName} file upload failed the result is ${e.message}`);
    }
  }



  private async updateProjectInfo({ apps, project, domain, favicon, defaultApp }) {
    const copyApps = _.cloneDeepWith(apps);
    apps.forEach((app) => {
      app.sourceCode && delete app.sourceCode;
      app.releaseCode && delete app.releaseCode;
      app.redirects && delete app.redirects;
    })
    const updatePayload = {
      domain,
      project,
      projectInfo: {
        id: project,
        domain,
        favicon,
        defaultApp,
        apps
      }
    };
    const updateResult = await updateProject(updatePayload); // 更新应用元数据信息
    if (updateResult.success) {
      await this.checkAndUploadFiles({
        apps: copyApps,
        domain
      });
    }
  }

  private async exeBuildWebStaticCmd(_path: string, appName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(path.join(_path, 'package.json'))) {
        const buildCmd = spawn('npm', ['run', 'build'], {
          shell: true,
          cwd: _path,
          stdio: 'inherit'
        });
        buildCmd.on('close', (code) => {
          logger.success(`【${appName}】 execute build successfuly`);
          resolve({ code });
        });
      } else {
        resolve({});
      }
    })
  }

  private async checkAndUploadFiles({ apps, domain }) {
    const allAppFunction = [];
    apps.forEach(async (item, i) => {
      const promiseFunction = new Promise(async (resolve, reject) => {
        try {
          const appName = item.name;
          const sourceCode = item.sourceCode; // 源码文件，需要构建
          const releaseCode = item.releaseCode; // 构建好的静态文件
          let redirects = item.redirects;
          if (redirects) {
            redirects = path.join(process.cwd(), item.redirects); // 重定向文件
            if (redirects && fs.existsSync(redirects)) { // 如果用户设置了重定向文件则将其上传
              await this.uploadFiles(redirects, { domain, appName, fileName: '_redirects' });
            }
          }
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
                promiseArr.push(new Promise(async (resolve, reject) => {
                  await this.uploadFiles(fileName, { domain, appName }, staicsFilesPath);
                  resolve('');
                }))
              });
              await Promise.all(promiseArr);
              logger.info(`-----【${appName}】 upload completed ----- \n\n`);
              resolve(i);
            };
          } else if (fs.existsSync(releaseCode)) { // 如果有直接指定静态文件直接进行上传

            const files = this.travelAsync(releaseCode);
            const promiseArr = [];
            files.forEach((fileName) => {
              promiseArr.push(new Promise(async (resolve, reject) => {
                await this.uploadFiles(fileName, { domain, appName }, releaseCode);
                resolve('');
              }))
            });
            await Promise.all(promiseArr);
            logger.info(`-----【${appName}】 upload completed ----- \n\n`);
            resolve(i);
          }
          else {
            resolve(i);
          }
        } catch (e) {
          reject(e);
        }
      })
      allAppFunction.push(promiseFunction);
    });
    const allPromise = await Promise.all(allAppFunction);
    return allPromise;
  }

  public async deploy(inputs: InputProps) {
    const { domain, apps, defaultApp, favicon } = inputs.props;
    try {
      const credentials = inputs.credentials;
      this.setEnv(credentials);
      const result = await createProject(domain);
      if (result.success) {
        logger.info(`新应用创建成功 ，开始进行文件上传... \n\n`);
        const project = result.data.id;
        await new Promise(async (resolve, reject) => {
          setTimeout(async () => {
            await this.updateProjectInfo({
              apps,
              project,
              domain,
              favicon,
              defaultApp
            });
            resolve('');
          }, 4000)
        });
      } else if (result.msg.indexOf('AppSync-100501') !== -1) { // 已经存在域名

        const projectInfo = await getProjectInfo({
          domain
        });
        await this.updateProjectInfo({
          apps,
          project: projectInfo.id,
          domain,
          favicon,
          defaultApp,
        });
      } else {
        throw Error(result.msg)
      }
      const result_domain = `https://${domain}`
      const successInfo = [`部署成功,访问域名: ${result_domain}`, '部署信息：', yaml.dump(inputs.props)].join('\n');
      super.__report({
        name: 'domain',
        content: {
          domain: result_domain,
          weight: 3
        }
      });

      return successInfo;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
