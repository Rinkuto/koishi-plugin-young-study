export class HttpUtil {
  public static setParams = (url: string, params?: object): string => {
    if (params === undefined) {
      return url;
    }
    let paramStr = '';
    for (let key in params) {
      if (params[key] === undefined) {
        paramStr += `${key}=&`
      } else {
        paramStr += `${key}=${encodeURIComponent(params[key])}&`;
      }
    }
    return `${url}?${paramStr.substring(0, paramStr.length - 1)}`;
  }
}
