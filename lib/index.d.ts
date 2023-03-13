import { Context, Schema } from 'koishi';
import { StudyUser } from "./Types";
export declare const name = "young-study";
export interface Config {
}
declare module 'koishi' {
    interface Tables {
        study_user: StudyUser;
    }
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context): void;
