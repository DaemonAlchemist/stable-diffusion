import * as request from 'superagent';
import { apiBase } from "./config";

export const api = {
    get: <T extends Object, Q extends {} = {}>(url: string, query:Q):Promise<T> => 
        request.get(`${apiBase}/${url}`)
        .set({
            Accepts: 'application/json',
        })
        .query(Object.keys(query)
            .filter(k => !!query[k])
            .reduce((a, k) => ({ ...a, [k]: query[k] }), {})
        )
        .then((response:any) => response.body as T),
    delete: (url:string):Promise<string> =>
        request.delete(`${apiBase}/${url}`),
    exists: (url:string):Promise<boolean> => {
        const file = ["\\", "/"].includes(url[0]) ? url.substring(1) : url
        return request.get(`${apiBase}/${file}`)
            .then(() => true)
            .catch(() => false);
    },
}
