"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuBeiGQT = void 0;
const GQT_1 = require("./GQT");
const jsdom_1 = require("jsdom");
class HuBeiGQT extends GQT_1.GQT {
    constructor() {
        super(...arguments);
        // 最新的青年大学习地址
        this.CURRENT_URL = 'https://h5.cyol.com/special/weixin/sign.json';
        this.STUDY_URL = 'https://cp.fjg360.cn/index.php';
        this.CURRENT_IMAGE_URL = 'https://h5.cyol.com/special/daxuexi/';
    }
    async bind(config) {
        return {
            result: config.join('-'),
            message: 'success',
        };
    }
    async getLatestClass() {
        const resp = await this.http.get(this.CURRENT_URL);
        const key = Object.keys(resp);
        const url = resp[key[key.length - 1]]['url'];
        if (url === undefined) {
            return undefined;
        }
        const html = await this.http.get(url);
        const document = new jsdom_1.JSDOM(html).window.document;
        return {
            title: document.querySelector('title').textContent,
            code: key[key.length - 1],
        };
    }
    async study(study) {
        const lastClass = await this.getLatestClass();
        if (lastClass === undefined) {
            return {
                status: 500,
                message: '获取当前课程失败',
                result: study.name,
            };
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
            };
        }
        else {
            return {
                status: 500,
                message: '学习失败',
                result: study.name,
            };
        }
    }
    async resp(params) {
        return await this.http.get(this.STUDY_URL, {
            params,
        });
    }
    getParams(study) {
        const pos = study.pid.split('-');
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
            city: pos[0],
            danwei2: pos[1],
            danwei: pos[2], // 学院
        };
    }
    getImageUrl(code) {
        return `${this.CURRENT_IMAGE_URL}${code}/images/end.jpg`;
    }
    async search(config) {
        return ['湖北省暂时没有查团委哦~'];
    }
    async batchStudy(study) {
        const lastClass = await this.getLatestClass();
        const image = this.getImageUrl(lastClass.code);
        const result = [];
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
            }
            else {
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
exports.HuBeiGQT = HuBeiGQT;
