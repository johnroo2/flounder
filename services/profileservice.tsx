import axios, { AxiosInstance} from 'axios';
import AuthorizationHeader from '@/utils/authheader';
import servicewrapper from '@/utils/servicewrapper';

export class ProfileService{
    protected readonly instance:AxiosInstance;

    constructor(url:string){
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!"
        })
    }

    get = servicewrapper(async(username:string) => {
        return this.instance.get(`api/user/profile/${username}/`, AuthorizationHeader()).then((res) => res.data)
    }, this)

    put = servicewrapper(async(username:string, params:any) => {
        return this.instance.put(`api/user/profile/${username}/`, params, AuthorizationHeader()).then((res) => res.data)
    }, this)
}