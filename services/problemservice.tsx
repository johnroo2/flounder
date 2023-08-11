import axios, { AxiosInstance } from 'axios';
import AuthorizationHeader from '../utils/authheader';
import servicewrapper from '@/utils/servicewrapper';

export class ProblemService {
    protected readonly instance: AxiosInstance;

    constructor(url: string) {
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!"
        });
    }

    get = servicewrapper((params: any, id:any) => {
        return this.instance.get(`api/problem/${id ? `${id}/` : ''}`, AuthorizationHeader(params)).then((res) => res.data);
    }, this)

    getKey = servicewrapper((key:any) => {
        return this.instance.get(`api/problem/key/${key}/`, AuthorizationHeader()).then((res) => res.data);
    }, this)

    getKeyUser = servicewrapper((key:any, user:any) => {
        return this.instance.get(`api/problem/key/${key}/${user}/`, AuthorizationHeader()).then((res) => res.data);
    }, this)

    post = servicewrapper((params: any) => {
        return this.instance.post(`api/problem/`, params, AuthorizationHeader()).then((res) => res.data);
    }, this)

    verify = servicewrapper((key:any, params: any) => {
        return this.instance.post(`api/problem/key/${key}/`, params, AuthorizationHeader()).then((res) => res.data);
    }, this)

    delete = servicewrapper((id: any) => {
        return this.instance.delete(`api/problem/${id ? `${id}/` : ''}`, AuthorizationHeader()).then((res) => res.data);
    }, this)

    put = servicewrapper((params: any, id: any) => {
        return this.instance.put(`api/problem/${id ? `${id}/` : ''}`, params, AuthorizationHeader()).then((res) => res.data);
    }, this)

    putImage = servicewrapper((params:any, id: any) => {
        return this.instance.put(`api/problem/image/${id ? `${id}/` : ''}`, params, AuthorizationHeader()).then((res) => res.data);
    }, this)
}
