"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.name = void 0;
const jsx_runtime_1 = require("@satorijs/element/jsx-runtime");
const koishi_1 = require("koishi");
const JiangXiGQT_1 = require("./cly/JiangXiGQT");
const DataBaseUtil_1 = require("./util/DataBaseUtil");
exports.name = 'young-study';
const GQTContent = new Map();
exports.Config = koishi_1.Schema.object({});
function apply(ctx) {
    // write your plugin here
    ctx.model.extend('study_user', {
        qqId: 'string',
        pid: 'string',
        name: 'string',
        openId: 'string',
        province: 'string',
    }, {
        primary: 'qqId',
    });
    const logger = ctx.logger('young-study');
    initGQT(ctx.http);
    ctx.command('设置青年大学习 <config:text>', '绑定团委')
        .action(async ({ session }, config) => {
        if (config === undefined) {
            await send(session, '请按照格式输入，如：设置青年大学习 #江西#南昌市#青山湖区#团委#张三');
            return;
        }
        const option = config.split('#').slice(1);
        const gqt = GQTContent.get(option[0]);
        if (gqt === undefined) {
            await send(session, '暂不支持该省份');
            return;
        }
        const pid = await gqt.bind(option.slice(1, option.length - 1));
        if (pid.result !== undefined) {
            await DataBaseUtil_1.DataBaseUtil.setStudyUser({
                qqId: session.userId,
                pid: pid.result,
                name: option[option.length - 1],
                openId: getRandomOpenId(),
                province: option[0]
            }, ctx.database).then(() => {
                send(session, '设置成功');
            }).catch((e) => {
                logger.error(e);
                send(session, '设置失败');
            });
        }
        else {
            await send(session, `设置失败，${pid.message}`);
        }
    });
    ctx.command('开始青年大学习', '开始青年大学习')
        .action(async ({ session }) => {
        const user = await DataBaseUtil_1.DataBaseUtil.getStudyUser(session.userId, ctx.database);
        if (user === undefined || user.length === 0) {
            await session.send('请先设置团委');
            return;
        }
        const gqt = GQTContent.get(user[0].province);
        const result = await gqt.study(user[0]);
        if (result.status === 200) {
            await send(session, result.message);
            await send(session, result.image);
            logger.info(`${result.result}完成了青年大学习`);
        }
        else {
            await session.send(result.message);
        }
    });
    ctx.command('查团委 <config:text>', '查团委')
        .action(async ({ session }, config) => {
        if (config === undefined) {
            await send(session, '请按照格式输入，如：查团委 #江西#南昌市#青山湖区');
            return;
        }
        const option = config.split('#').slice(1);
        const gqt = GQTContent.get(option[0]);
        if (gqt === undefined) {
            await send(session, '暂不支持该省份');
            return;
        }
        const result = await gqt.search(option.slice(1, option.length));
        await send(session, result.join('\n'));
    });
}
exports.apply = apply;
// 随机生成openid
const getRandomOpenId = () => {
    const char = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
        'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
    let openid = 'oWtp';
    for (let i = 0; i < 14; i++) {
        openid += char[koishi_1.Random.int(0, char.length)];
    }
    openid += '-';
    for (let i = 0; i < 9; i++) {
        openid += char[koishi_1.Random.int(0, char.length)];
    }
    return openid;
};
const initGQT = (http) => {
    GQTContent.set('江西', new JiangXiGQT_1.JiangXiCYL(http));
};
const send = async (session, msg) => {
    // true 为私聊 false 为群聊
    const type = session.subtype === 'private';
    if (type) {
        if (msg.startsWith('http')) {
            await session.send((0, jsx_runtime_1.jsx)("image", { url: msg }));
        }
        else {
            await session.send(msg);
        }
    }
    else {
        // 如果msg是一张图片
        if (msg.startsWith('http')) {
            await session.send((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("at", { id: session.userId }), (0, jsx_runtime_1.jsx)("image", { url: msg })] }));
        }
        else {
            await session.send((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("at", { id: session.userId }), (0, jsx_runtime_1.jsx)("text", { content: msg })] }));
        }
    }
};
