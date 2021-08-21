import { IProjectPayload, IUpdateProjectPayload, IPutObjectPayload } from './entity';
export interface OperationResult {
    success: boolean;
    msg?: string;
    data?: {
        [index: string]: any;
    };
}
/**
 * 整个项目的调用
 * 1. createProject(申请一个domain会返回一个projectId)
 * 2. updateProject(将项目的信息s.yml转化后的json,和projectId进行关联)
 * @param domain
 * @returns
 */
/**
 * create project: 创建项目
 */
export declare const createProject: (domain: string) => Promise<OperationResult>;
/**
 * verify project
 * @param domain
 */
export declare const verifyProject: (domain: string) => Promise<OperationResult>;
export declare const listAppFiles: (domain: string, appName: string) => Promise<any>;
export declare const updateProject: (payload: IUpdateProjectPayload) => Promise<OperationResult>;
/**
 * 用户的project列表
 * list project
 */
export declare const listProject: (payload: IProjectPayload) => Promise<any>;
/**
 * 上传文件到OSS
 */
export declare const putObject: (payload: IPutObjectPayload) => Promise<any>;
export declare const listAppFilesAsync: (payload: any) => Promise<any>;
export declare const getProjectInfo: (payload: any) => Promise<any>;
