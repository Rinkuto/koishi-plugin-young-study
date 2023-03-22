import { Database, Query } from "koishi";
import { StudyUser } from "../Types";
export declare class DataBaseUtil {
    static getStudyUser(query: Query<any>, database: Database): Promise<StudyUser[]>;
    static setStudyUser(studyUser: StudyUser, database: Database): Promise<void>;
    static hasStudyUser(qqId: string, database: Database): Promise<boolean>;
}
