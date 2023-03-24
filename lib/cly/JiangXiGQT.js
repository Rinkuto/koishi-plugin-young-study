"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiangXiGQT = void 0;
const GQT_1 = require("./GQT");
class JiangXiGQT extends GQT_1.GQT {
    constructor() {
        super(...arguments);
        this.TW_URL = 'http://www.jxqingtuan.cn/pub/vol/config/organization?pid=';
        this.CURRENT_URL = 'http://www.jxqingtuan.cn/pub/vol/volClass/current';
        this.JOIN_URL = 'http://www.jxqingtuan.cn/pub/vol/volClass/join?accessToken=';
        // 一级团委
        this.firstLevel = new Map([
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
    async bind(config, openId, name, isNew) {
        let areaId = this.firstLevel.get(config[0]);
        if (areaId) {
            for (let i = 1; i < config.length; i++) {
                const resp = await this.getAreaId(areaId, config[i]);
                if (resp !== undefined) {
                    areaId = resp;
                }
                else {
                    return {
                        result: undefined,
                        message: `未找到团委：${config[i]}`,
                    };
                }
            }
        }
        else {
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
    async getAreaId(areaId, config) {
        const resp = await this.http.get(this.TW_URL + areaId);
        if (resp.result.length === 0) {
            return undefined;
        }
        return resp.result.find((value) => value.title === config)?.id;
    }
    async study(studyUser) {
        const lastClass = await this.getLatestClass();
        const response = await this.http.post(this.JOIN_URL + studyUser.openId, {
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
        };
    }
    getLastClassImage(url) {
        const index = url.lastIndexOf('/');
        return url.substring(0, index) + '/images/end.jpg';
    }
    // 查询最新的青年大学习期
    async getLatestClass() {
        const response = await this.http.get(this.CURRENT_URL);
        return response.result;
    }
    async search(config) {
        if (config.length === 0) {
            const result = [];
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
                }
                else {
                    return [`未找到：${config[i]}`];
                }
            }
        }
        else {
            return [`未找到：${config[0]}`];
        }
        const resp = await this.http.get(this.TW_URL + areaId);
        if (resp.result.length === 0) {
            return [`没有下级团委了哦`];
        }
        return resp.result.map((value) => value.title);
    }
    async batchStudy(studyUsers) {
        const lastClass = await this.getLatestClass();
        const result = [];
        for (const studyUser of studyUsers) {
            const response = await this.http.post(this.JOIN_URL + studyUser.openId, {
                cardNo: studyUser.name,
                nid: studyUser.pid,
                accessToken: studyUser.openId,
                course: lastClass.id,
            });
            if (response.status === 200) {
                result.push({
                    image: this.getLastClassImage(lastClass.uri),
                    result: response.result,
                    status: 200,
                    message: `你已经完成了${lastClass.title}的学习`
                });
            }
            else {
                result.push({
                    result: response.result,
                    status: response.status,
                    message: response.message,
                });
            }
        }
        return result;
    }
}
exports.JiangXiGQT = JiangXiGQT;
