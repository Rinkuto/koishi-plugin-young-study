import {BindType, Result, StudyUser} from "../Types";
import {Quester} from "koishi";

export class GQT {

  protected readonly http: Quester;

  /**
   * 绑定团委
   * @param config 团委组织['一级团委','二级团委','三级团委',...]
   * @return BindType 绑定结果
   */
  async bind(config: string[]): Promise<BindType> {
    return undefined;
  };

  /**
   * 青年大学习方法
   * @param study 学习用户
   * @return Result 学习结果
   */
  async study(study: StudyUser): Promise<Result> {
    return null;
  };

  /**
   * 搜索团委
   * @param config 团委组织
   */
  async search(config: string[]): Promise<string[]> {
    return [];
  }

  /**
   * 批量青年大学习
   * @param study
   */
  async batchStudy(study: StudyUser[]): Promise<Result[]> {
    return [];
  }

  constructor(http: Quester) {
    this.http = http;
  }

}
