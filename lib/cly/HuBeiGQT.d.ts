import { GQT } from "./GQT";
import { BindType, Result, StudyUser } from "../Types";
export declare class HuBeiGQT extends GQT {
    bind(config: string[]): Promise<BindType>;
    private CURRENT_URL;
    private getLatestClass;
    private STUDY_URL;
    study(study: StudyUser): Promise<Result>;
    private resp;
    private getParams;
    private CURRENT_IMAGE_URL;
    private getImageUrl;
    search(config: string[]): Promise<string[]>;
    batchStudy(study: StudyUser[]): Promise<Result[]>;
}
