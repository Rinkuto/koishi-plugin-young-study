"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpUtil = void 0;
class HttpUtil {
}
exports.HttpUtil = HttpUtil;
HttpUtil.setParams = (url, params) => {
    if (params === undefined) {
        return url;
    }
    let paramStr = '';
    for (let key in params) {
        if (params[key] === undefined) {
            paramStr += `${key}=&`;
        }
        else {
            paramStr += `${key}=${encodeURIComponent(params[key])}&`;
        }
    }
    return `${url}?${paramStr.substring(0, paramStr.length - 1)}`;
};
