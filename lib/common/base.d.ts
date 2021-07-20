export default class BaseComponent {
    protected inputs: any;
    protected client: any;
    private name;
    private basePath;
    constructor(inputs: any);
    __getBasePath(): string;
    __doc(projectName?: string): string;
    protected __report(reportData: ServerlessDevsReport.ReportData): ServerlessDevsReport.Domain | ServerlessDevsReport.Fc | ServerlessDevsReport.Oss | ServerlessDevsReport.Ram | ServerlessDevsReport.Sls | ServerlessDevsReport.ApiGw | ServerlessDevsReport.CDN | ServerlessDevsReport.Vpc | ServerlessDevsReport.Fnf | ServerlessDevsReport.Cr | ServerlessDevsReport.Sae;
}
