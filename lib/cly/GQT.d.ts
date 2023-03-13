import { BindType, Result, StudyUser } from "../Types";
import { Quester } from "koishi";
export declare class GQT {
    protected readonly http: Quester;
    /**
     * 绑定团委
     * @param config 团委组织
     */
    bind(config: string[]): Promise<BindType>;
    study(study: StudyUser): Promise<Result>;
    search(config: string[]): Promise<string[]>;
    constructor(http: Quester);
}
