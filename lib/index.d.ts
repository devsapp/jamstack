import BaseComponent from './common/base';
import { InputProps } from './common/entity';
export default class ComponentDemo extends BaseComponent {
    protected ignoreFiles: any[];
    constructor(props: any);
    private setEnv;
    private travel;
    private travelAsync;
    private uploadFile;
    /**
     * update project metadata and upload the files
     */
    private updateProjectInfo;
    private exeBuildWebStaticCmd;
    private checkAndUploadFiles;
    deploy(inputs: InputProps): Promise<string>;
}
