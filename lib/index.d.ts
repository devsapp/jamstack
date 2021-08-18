import BaseComponent from './common/base';
import { InputProps } from './common/entity';
export default class ComponentDemo extends BaseComponent {
    constructor(props: any);
    private setEnv;
    private travel;
    private travelAsync;
    private uploadFiles;
    /**
     * update project metadata and upload the files
     */
    private updateProjectInfo;
    private exeBuildWebStaticCmd;
    private checkAndUploadFiles;
    deploy(inputs: InputProps): Promise<string>;
}
