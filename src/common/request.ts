import { IProjectPayload, IUpdateProjectPayload, IPutObjectPayload } from './entity';
import getJwtToken from './jwt-token';

/**
 * 整个项目的调用
 * 1. createProject(申请一个domain会返回一个projectId)
 * 2. updateProject(将项目的信息s.yml转化后的json,和projectId进行关联)
 * @param domain
 * @returns
 */

/**
 * 创建项目
 * create project
 */
export const createProject = async (domain: string) =>
  getJwtToken(`/project/create/${domain}`, {
    method: 'POST',
  });

export const updateProject = async (payload: IUpdateProjectPayload) =>
  getJwtToken(`/project/update/${payload.domain}`, {
    method: 'POST',
    ...payload,
    body: payload.projectInfo,
  });

/**
 * 用户的project列表
 * list project
 */
export const listProject = async (payload: IProjectPayload) => getJwtToken('/project/index', payload);

/**
 * 上传文件到OSS
 */
export const putObject = async (payload: IPutObjectPayload) =>
  getJwtToken(`/object/${payload.domain}/${payload.appName}/${payload.fileName}`, {
    ...payload,
    method: 'POST',
  });
export const listAppFilesasync = async (payload) =>
  getJwtToken(`/objects/${payload.domain}/${payload.appName}?marker=`, {
    ...payload,
    method: 'GET',
  });

export const getProjectInfo = async (payload) => getJwtToken(`/project/show/${payload.domain}`, payload);
