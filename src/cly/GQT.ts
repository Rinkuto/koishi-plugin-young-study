import {BindType, Result, StudyUser} from "../Types";
import {Quester} from "koishi";

export class GQT {

  protected readonly http: Quester;

  /**
   * 绑定团委
   * @param config 团委组织
   */
  async bind(config: string[]): Promise<BindType>{
    return undefined;
  };

  async study(study:StudyUser): Promise<Result>{
    return null;
  };

  async search(config: string[]): Promise<string[]>{
    return [];
  }

  constructor(http: Quester) {
    this.http = http;
  }

}
