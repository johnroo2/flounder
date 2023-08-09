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

    get = async(username:string) => {
        return this.instance.get(`api/profile/${username}/`, AuthorizationHeader()).then((res) => res.data)
    }

    put = servicewrapper(async(username:string, params:any) => {
        console.log(params)
        return this.instance.put(`api/profile/${username}/`, params, AuthorizationHeader()).then((res) => res.data)
    }, this)
}