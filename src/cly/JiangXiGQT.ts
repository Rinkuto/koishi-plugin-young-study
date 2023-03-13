import {GQT} from "./GQT";
import {Quester} from "koishi";
import {BindType, JiangXiCYLType, Result, StudyUser} from "../Types";

export class JiangXiCYL extends GQT {

  private readonly TW_URL = 'http://www.jxqingtuan.cn/pub/vol/config/organization?pid=';

  private readonly CURRENT_URL = 'http://www.jxqingtuan.cn/pub/vol/volClass/current';

  public async bind(config: string[]): Promise<BindType> {
    let areaId = this.firstLevel.get(config[0]);
    if (areaId) {
      for (let i = 1; i < config.length; i++) {
        const resp = await this.getAreaId(areaId, config[i]);
        if (resp !== undefined) {
          areaId = resp;
        } else {
          return {
            result: undefined,
            message: `未找到团委：${config[i]}`,
          };
        }
      }
    } else {
      return {
        result: undefined,
        message: `未找到团委：${config[0]}`,
      };
    }

    const resp = await this.http.get(this.TW_URL + areaId);
    if (resp.result.length === 0) {
      return {
        result: areaId,
        message: 'success',
      };
    }
    return {
      result: undefined,
      message: `还有下级团委没`,
    };
  }

  /**
   * 获取下级团委Id
   * @param areaId 团委Id
   * @param config 团委名称
   * @private
   */
  private async getAreaId(areaId: string, config: string): Promise<string | undefined> {
    const resp = await this.http.get<JiangXiCYLType>(this.TW_URL + areaId);
    if (resp.result.length === 0) {
      return undefined;
    }
    return resp.result.find((value) => value.title === config)?.id;
  }

  private readonly JOIN_URL = 'http://www.jxqingtuan.cn/pub/vol/volClass/join?accessToken=';

  public async study(studyUser: StudyUser): Promise<Result> {
    const lastClass = await this.getLatestClass();
    const response = await this.http.post<Result>(this.JOIN_URL + studyUser.openId, {
      cardNo: studyUser.name,
      nid: studyUser.pid,
      accessToken: studyUser.openId,
      course: lastClass.id,
    });
    if (response.status === 200) {
      return {
        image: this.getLastClassImage(lastClass.uri),
        result: response.result,
        status: 200,
        message: `你已经完成了${lastClass.title}的学习`
      };
    }
    return {
      result: response.result,
      status: response.status,
      message: response.message,
    }
  }

  public getLastClassImage(url: string): string {
    const index = url.lastIndexOf('/');
    return url.substring(0, index) + '/images/end.jpg';
  }

  // 查询最新的青年大学习期
  private async getLatestClass(): Promise<{ id: number; title: string; uri: string }> {
    const response = await this.http.get<{
      result: {
        id: number,
        title: string,
        uri: string,
      }
    }>(this.CURRENT_URL);
    return response.result;
  }

  public async search(config: string[]): Promise<string[]> {
    if (config.length === 0) {
      const result: string[] = [];
      for (let key of this.firstLevel.keys()) {
        result.push(key);
      }
      return result;
    }
    let areaId = this.firstLevel.get(config[0]);
    if (areaId) {
      for (let i = 1; i < config.length; i++) {
        const resp = await this.getAreaId(areaId, config[i]);
        if (resp !== undefined) {
          areaId = resp;
        } else {
          return [`未找到：${config[i]}`];
        }
      }
    } else {
      return [`未找到：${config[0]}`];
    }
    const resp = await this.http.get<JiangXiCYLType>(this.TW_URL + areaId);
    if (resp.result.length === 0) {
      return [`没有下级团委了哦`];
    }
    return resp.result.map((value) => value.title);
  }


  // 一级团委
  private readonly firstLevel: Map<string, string> = new Map<string, string>([
    ['南昌市', 'N0002'],
    ['九江市', 'N0003'],
    ['景德镇市', 'N0004'],
    ['萍乡市', 'N0005'],
    ['新余市', 'N0006'],
    ['鹰潭市', 'N0007'],
    ['赣州市', 'N0008'],
    ['宜春市', 'N0009'],
    ['上饶市', 'N0010'],
    ['吉安市', 'N0011'],
    ['抚州市', 'N0012'],
    ['省属本科院校团委', 'N0013'],
    ['非省属本科院校团委', 'N0014'],
    ['高职专科院校团委', 'N0015'],
    ['省直属单位团委', 'N0016']
  ]);
}
