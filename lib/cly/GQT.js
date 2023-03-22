"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQT = void 0;
class GQT {
    /**
     * 绑定团委
     * @param config 团委组织['一级团委','二级团委','三级团委',...]
     * @return BindType 绑定结果
     */
    async bind(config) {
        return undefined;
    }
    ;
    /**
     * 青年大学习方法
     * @param study 学习用户
     * @return Result 学习结果
     */
    async study(study) {
        return null;
    }
    ;
    /**
     * 搜索团委
     * @param config 团委组织
     */
    async search(config) {
        return [];
    }
    /**
     * 批量青年大学习
     * @param study
     */
    async batchStudy(study) {
        return [];
    }
    constructor(http) {
        this.http = http;
    }
}
exports.GQT = GQT;
