"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuBeiGQT = void 0;
const GQT_1 = require("./GQT");
const jsdom_1 = require("jsdom");
const HttpUtil_1 = require("../util/HttpUtil");
class HuBeiGQT extends GQT_1.GQT {
    constructor() {
        super(...arguments);
        this.SAVE_DOOR_URL = 'https://cp.fjg360.cn/index.php';
        this.BIND_USER_URL = 'https://api.fjg360.cn/index.php';
        this.bindUser = async (study, isNew) => {
            const params = this.getParams('bind_user', study);
            params.lesson_name = await this.getLatestClass().then(value => value.title);
            params.is_edit = isNew ? 0 : 1;
            return await this.http.get(HttpUtil_1.HttpUtil.setParams(this.BIND_USER_URL, params));
        };
        // 最新的青年大学习地址
        this.CURRENT_URL = 'https://h5.cyol.com/special/weixin/sign.json';
        this.CURRENT_IMAGE_URL = 'https://h5.cyol.com/special/daxuexi/';
    }
    async bind(config, openId, name, isNew) {
        const user = {
            name: name, openId: openId, pid: config.join('-'), province: "", qqId: ""
        };
        const resp = await this.bindUser(user, isNew);
        if (resp.code == 1) {
            return {
                result: config.join('-'),
                message: 'success',
            };
        }
        else {
            return {
                result: undefined,
                message: resp.msg,
            };
        }
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
        const params = this.getParams('save_door', study);
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
        return await this.http.get(HttpUtil_1.HttpUtil.setParams(this.SAVE_DOOR_URL, params));
    }
    getParams(a, study) {
        const params = {
            m: 'vote',
            c: 'index',
            a: a,
            openid: study.openId,
        };
        if (a === 'get_members') {
            return params;
        }
        else {
            const pos = study.pid.split('-');
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
            }
            else if (a === 'bind_user') {
                params['is_edit'] = 1;
            }
        }
        return params;
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
