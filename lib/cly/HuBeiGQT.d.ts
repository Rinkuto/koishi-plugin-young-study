import { GQT } from "./GQT";
import { BindType, Result, StudyUser } from "../Types";
export declare class HuBeiGQT extends GQT {
    private readonly SAVE_DOOR_URL;
    private readonly BIND_USER_URL;
    bind(config: string[], openId: string, name: string, isNew: boolean): Promise<BindType>;
    private bindUser;
    private CURRENT_URL;
    private getLatestClass;
    study(study: StudyUser): Promise<Result>;
    private resp;
    private getParams;
    private CURRENT_IMAGE_URL;
    private getImageUrl;
    search(config: string[]): Promise<string[]>;
    batchStudy(study: StudyUser[]): Promise<Result[]>;
}
