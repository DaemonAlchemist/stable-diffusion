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
}
