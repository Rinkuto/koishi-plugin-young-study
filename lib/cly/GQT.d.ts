import { BindType, Result, StudyUser } from "../Types";
import { Quester } from "koishi";
export declare class GQT {
    protected readonly http: Quester;
    /**
     * 绑定团委
     * @param config 团委组织['一级团委','二级团委','三级团委',...]
     * @param openId 用户openId
     * @param name 用户姓名
     * @param isNew 是否是新用户
     * @return BindType 绑定结果
     */
    bind(config: string[], openId: string, name: string, isNew: boolean): Promise<BindType>;
    /**
     * 青年大学习方法
     * @param study 学习用户
     * @return Result 学习结果
     */
    study(study: StudyUser): Promise<Result>;
    /**
     * 搜索团委
     * @param config 团委组织
     */
    search(config: string[]): Promise<string[]>;
    /**
     * 批量青年大学习
     * @param study
     */
    batchStudy(study: StudyUser[]): Promise<Result[]>;
    constructor(http: Quester);
}
