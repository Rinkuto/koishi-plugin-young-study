export interface JiangXiCYLType {
    result: {
        id: string;
        title: string;
    }[];
}
export interface BindType {
    result: string;
    message: string;
}
export interface StudyUser {
    pid: string;
    openId: string;
    qqId: string;
    name: string;
    province: string;
}
export interface Result {
    result: string;
    status: number;
    image?: string;
    message?: string;
}
