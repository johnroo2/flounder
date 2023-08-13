import axios, { AxiosInstance } from 'axios';
import AuthorizationHeader from '../utils/authheader';
import servicewrapper from '@/utils/servicewrapper';

export class ProblemVoteService {
    protected readonly instance: AxiosInstance;

    constructor(url: string) {
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!"
        });
    }

    get = servicewrapper((params: any, id:any) => {
        return this.instance.get(`api/problemvote/${id ? `${id}/` : ''}`, AuthorizationHeader()).then((res) => res.data);
    }, this)

    post = servicewrapper((params: any) => {
        return this.instance.post(`api/problemvote/`, params, AuthorizationHeader()).then((res) => res.data);
    }, this)

    delete = servicewrapper((id: any) => {
        return this.instance.delete(`api/problemvote/${id ? `${id}/` : ''}`, AuthorizationHeader()).then((res) => res.data);
    }, this)

    put = servicewrapper((params: any, id: any) => {
        return this.instance.put(`api/problemvote/${id ? `${id}/` : ''}`, params, AuthorizationHeader()).then((res) => res.data);
    }, this)
}
