import {Database, Query} from "koishi";
import {StudyUser} from "../Types";
import {logger} from "koishi-plugin-gocqhttp";

export class DataBaseUtil {


  public static async getStudyUser(query: Query<any>, database: Database): Promise<StudyUser[]> {
    const res = [];
    const users = await database.get('study_user', query);
    for (let user of users) {
      res.push(user);
    }
    return res;
  }

  public static async setStudyUser(studyUser: StudyUser, database: Database): Promise<void> {
    if (!await this.hasStudyUser(studyUser.qqId, database)) {
      await database.create('study_user', studyUser);
    } else {
      await database.set('study_user', {
        qqId: studyUser.qqId,
      }, {
        pid: studyUser.pid,
        name: studyUser.name,
        province: studyUser.province,
      });
    }

  }

  public static async hasStudyUser(qqId: string, database: Database): Promise<boolean> {
    const user = await this.getStudyUser({qqId: qqId}, database);
    return user.length !== 0;
  }
}
