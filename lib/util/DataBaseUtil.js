"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseUtil = void 0;
class DataBaseUtil {
    static async getStudyUser(query, database) {
        const res = [];
        const users = await database.get('study_user', query);
        for (let user of users) {
            res.push(user);
        }
        return res;
    }
    static async setStudyUser(studyUser, database) {
        if (!await this.hasStudyUser(studyUser.qqId, database)) {
            await database.create('study_user', studyUser);
        }
        else {
            await database.set('study_user', {
                qqId: studyUser.qqId,
            }, {
                pid: studyUser.pid,
                name: studyUser.name,
                province: studyUser.province,
            });
        }
    }
    static async insertStudyUser(studyUser, database) {
        await database.create('study_user', studyUser);
    }
    static async updateStudyUser(studyUser, database) {
        await database.set('study_user', {
            qqId: studyUser.qqId,
        }, {
            pid: studyUser.pid,
            name: studyUser.name,
            province: studyUser.province,
        });
    }
    static async hasStudyUser(qqId, database) {
        const user = await this.getStudyUser({ qqId: qqId }, database);
        return user.length !== 0;
    }
}
exports.DataBaseUtil = DataBaseUtil;
