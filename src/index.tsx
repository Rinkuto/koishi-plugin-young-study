import {Context, Quester, Random, Schema, Session} from 'koishi'
import {JiangXiGQT} from "./cly/JiangXiGQT";
import * as http from "http";
import {it} from "node:test";
import {DataBaseUtil} from "./util/DataBaseUtil";
import {StudyUser} from "./Types";
import {GQT} from './cly/GQT';
import {HuBeiGQT} from "./cly/HuBeiGQT";

export const name = 'young-study'

export interface Config {
}

declare module 'koishi' {
  interface Tables {
    study_user: StudyUser,
  }
}

const GQTContent = new Map<string, GQT>();
export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
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

  const logger = ctx.logger('young-study')
  initGQT(ctx.http);

  ctx.command('设置青年大学习 <config:text>', '绑定团委')
    .action(async ({session}, config) => {
      if (config === undefined) {
        await send(session, '请按照格式输入，如：设置青年大学习 #江西#省属本科院校团委#xx大学团委#xx学院团委#xxx团支部#张三');
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
        await DataBaseUtil.setStudyUser({
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
        })
      } else {
        await send(session, `设置失败，${pid.message}`);
      }
    })

  ctx.command('开始青年大学习', '开始青年大学习')
    .action(async ({session}) => {
      const user = await DataBaseUtil.getStudyUser(session.userId, ctx.database);
      if (user === undefined || user.length === 0) {
        await session.send('请先设置团委');
        return;
      }
      const gqt = GQTContent.get(user[0].province);
      const result = await gqt.study(user[0]);
      console.log(result.image)
      if (result.status === 200) {
        await send(session, result.message);
        await send(session, result.image);
        logger.info(`${result.result}完成了青年大学习`);
      } else {
        await session.send(result.message);
      }
    })

  ctx.command('查团委 <config:text>', '查团委')
    .action(async ({session}, config) => {
      if (config === undefined) {
        await send(session, '请按照格式输入，如：查团委 #江西#省属本科院校团委#xx大学团委');
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
    })

  ctx.command('批量青年大学习', '批量青年大学习', {authority: 3})
    .action(async ({session}) => {
      const user = await DataBaseUtil.getStudyUser({qqId: session.userId}, ctx.database);
      if (user === undefined || user.length === 0) {
        await session.send('请先设置团委');
        return;
      }
      const users = await DataBaseUtil.getStudyUser({pid: user[0].pid}, ctx.database);
      const gqt = GQTContent.get(user[0].province);
      const results = await gqt.batchStudy(users);
      const success = results.filter((r) => r.status === 200);
      const fail = results.filter((r) => r.status !== 200);

      await send(session, `青年大学习批量学习完成\n以下同学学习成功：${success.length === 0 ? '无' : success.map((s) => s.result).join(',')}，共${success.length}人\n以下同学学习失败：${fail.length === 0 ? '无' : fail.map((f) => f.result).join(',')}，共${fail.length}人`)
    })
}

// 随机生成openid
const getRandomOpenId = () => {
  const char = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
    'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'];
  let openid = 'oWtp';
  for (let i = 0; i < 14; i++) {
    openid += char[Random.int(0, char.length)];
  }
  openid += '-';
  for (let i = 0; i < 9; i++) {
    openid += char[Random.int(0, char.length)];
  }
  return openid;
}

const initGQT = (http: Quester) => {
  GQTContent.set('江西', new JiangXiGQT(http));
  GQTContent.set('湖北', new HuBeiGQT(http));
}

const send = async (session: Session, msg: string) => {
  // true 为私聊 false 为群聊
  const type = session.subtype === 'private'

  if (type) {
    if (msg.startsWith('http')) {
      await session.send(<image url={msg}/>);
    } else {
      await session.send(msg);
    }
  } else {
    // 如果msg是一张图片
    if (msg.startsWith('http')) {
      await session.send(
        <>
          <at id={session.userId}/>
          <image url={msg}/>
        </>
      );
    } else {
      await session.send(
        <>
          <at id={session.userId}/>
          <text content={msg}/>
        </>
      );
    }
  }
}
