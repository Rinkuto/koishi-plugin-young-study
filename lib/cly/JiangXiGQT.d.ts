import { GQT } from "./GQT";
import { BindType, Result, StudyUser } from "../Types";
export declare class JiangXiGQT extends GQT {
    private readonly TW_URL;
    private readonly CURRENT_URL;
    bind(config: string[], openId: string, name: string, isNew: boolean): Promise<BindType>;
    /**
     * 获取下级团委Id
     * @param areaId 团委Id
     * @param config 团委名称
     * @private
     */
    private getAreaId;
    private readonly JOIN_URL;
    study(studyUser: StudyUser): Promise<Result>;
    getLastClassImage(url: string): string;
    private getLatestClass;
    search(config: string[]): Promise<string[]>;
    batchStudy(studyUsers: StudyUser[]): Promise<Result[]>;
    private readonly firstLevel;
}
