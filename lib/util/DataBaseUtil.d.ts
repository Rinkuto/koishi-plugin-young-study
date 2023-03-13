import { Database } from "koishi";
import { StudyUser } from "../Types";
export declare class DataBaseUtil {
    static getStudyUser(qqId: string, database: Database): Promise<StudyUser[]>;
    static setStudyUser(studyUser: StudyUser, database: Database): Promise<void>;
    static hasStudyUser(qqId: string, database: Database): Promise<boolean>;
}
