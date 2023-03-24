import {GQT} from "./GQT";
import {BindType, Result, StudyUser} from "../Types";
import {JSDOM} from 'jsdom';
import {HttpUtil} from "../util/HttpUtil";

export class HuBeiGQT extends GQT {
  private readonly SAVE_DOOR_URL = 'https://cp.fjg360.cn/index.php';
  private readonly BIND_USER_URL = 'https://api.fjg360.cn/index.php';

  async bind(config: string[], openId: string, name: string, isNew: boolean): Promise<BindType> {
    const user: StudyUser = {
      name: name, openId: openId, pid: config.join('-'), province: "", qqId: ""
    };
    const resp = await this.bindUser(user, isNew);
    if (resp.code == 1) {
      return {
        result: config.join('-'),
        message: 'success',
      };
    } else {
      return {
        result: undefined,
        message: resp.msg,
      }
    }
  }

  private bindUser = async (study: StudyUser, isNew: boolean): Promise<{
    is_sucess: string,
    uid: string,
    code: number,
    msg: string,
  }> => {
    const params = this.getParams('bind_user', study);
    params.lesson_name = await this.getLatestClass().then(value => value.title);
    params.is_edit = isNew ? 0 : 1;
    return await this.http.get<{
      is_sucess: string,
      uid: string,
      code: number,
      msg: string,
    }>(HttpUtil.setParams(this.BIND_USER_URL, params));
  }

  // 最新的青年大学习地址
  private CURRENT_URL = 'https://h5.cyol.com/special/weixin/sign.json';

  private async getLatestClass(): Promise<{
    title: string,
    code: string,
  }> {
    const resp = await this.http.get(this.CURRENT_URL);
    const key = Object.keys(resp);
    const url = resp[key[key.length - 1]]['url'];
    if (url === undefined) {
      return undefined;
    }
    const html = await this.http.get(url);
    const document = new JSDOM(html).window.document as Document;
    return {
      title: document.querySelector('title').textContent,
      code: key[key.length - 1],
    }
  }

  async study(study: StudyUser): Promise<Result> {
    const lastClass = await this.getLatestClass();
    if (lastClass === undefined) {
      return {
        status: 500,
        message: '获取当前课程失败',
        result: study.name,
      }
    }
    const params = this.getParams('save_door', study);
    params.lesson_name = lastClass.title;

    const resp = await this.resp(params);
    if (resp?.is_sucess === 1) {
      return {
        status: 200,
        message: `你已经完成了${lastClass.title}的学习`,
        result: study.name,
        image: this.getImageUrl(lastClass.code),
      }
    } else {
      return {
        status: 500,
        message: '学习失败',
        result: study.name,
      }
    }
  }

  private async resp(params: object): Promise<{
    is_sucess?: number,
    code?: number,
  }> {
    return await this.http.get(HttpUtil.setParams(this.SAVE_DOOR_URL, params));
  }

  private getParams(a: "get_members" | "bind_user" | "save_door", study: StudyUser): any {
    const params = {
      m: 'vote',
      c: 'index',
      a: a,
      openid: study.openId,
    }
    if (a === 'get_members') {
      return params;
    } else {
      const pos: string[] = study.pid.split('-');
      params['ip'] = undefined;
      params['sessionId'] = undefined;
      params['imgTextId'] = undefined;
      params['username'] = study.name;
      params['phone'] = '未知';
      params['city'] = pos[0];
      params['danwei'] = pos[1];
      params['danwei2'] = pos[2];
      params['lesson_name'] = '';
      if (a === 'save_door') {
        params['num'] = 10;
      } else if (a === 'bind_user') {
        params['is_edit'] = 1;
      }
    }
    return params;
  }

  private CURRENT_IMAGE_URL = 'https://h5.cyol.com/special/daxuexi/';

  private getImageUrl(code: string): string {
    return `${this.CURRENT_IMAGE_URL}${code}/images/end.jpg`;
  }


  async search(config: string[]): Promise<string[]> {
    return ['湖北省暂时没有查团委哦~'];
  }

  async batchStudy(study: StudyUser[]): Promise<Result[]> {
    const lastClass = await this.getLatestClass();
    const image = this.getImageUrl(lastClass.code);
    const result: Result[] = [];
    for (let user of study) {
      const params = this.getParams('save_door', user);
      params.lesson_name = lastClass.title;
      const resp = await this.resp(params);
      if (resp?.is_sucess === 1) {
        result.push({
          status: 200,
          message: 'success',
          result: user.name,
          image: image,
        });
      } else {
        result.push({
          status: 500,
          message: '学习失败',
          result: user.name,
        });
      }
    }
    return result;
  }
}
