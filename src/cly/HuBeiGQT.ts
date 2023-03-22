import {GQT} from "./GQT";
import {BindType, Result, StudyUser} from "../Types";
import {JSDOM} from 'jsdom';

export class HuBeiGQT extends GQT {
  async bind(config: string[]): Promise<BindType> {
    return {
      result: config.join('-'),
      message: 'success',
    };
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

  private STUDY_URL = 'https://cp.fjg360.cn/index.php';

  async study(study: StudyUser): Promise<Result> {
    const lastClass = await this.getLatestClass();
    if (lastClass === undefined) {
      return {
        status: 500,
        message: '获取当前课程失败',
        result: study.name,
      }
    }
    const params = this.getParams(study);
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

  private async resp(params: any): Promise<{
    is_sucess?: number,
    code?: number,
  }> {
    return await this.http.get(this.STUDY_URL, {
      params,
    });
  }

  private getParams(study: StudyUser) {
    const pos: string[] = study.pid.split('-');
    return {
      openid: study.openId,
      m: 'vote',
      c: 'index',
      a: 'save_door',
      sessionId: undefined,
      imgTextId: undefined,
      ip: undefined,
      username: study.name,
      phone: '未知',
      num: 10,
      lesson_name: '',
      city: pos[0], //学校
      danwei2: pos[1], // 班级
      danwei: pos[2], // 学院
    };
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
      const params = this.getParams(user);
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
