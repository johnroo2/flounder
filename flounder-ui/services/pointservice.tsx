import servicewrapper from '@/utils/servicewrapper';
import axios, { AxiosInstance} from 'axios';

export class PointService{
    protected readonly instance:AxiosInstance;

    constructor(url:string){
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!"
        })
    }

    get = servicewrapper(async(username:any) => {
        return this.instance.get(
            `api/user/points/${username}/`
        ).then((res) => res.data)
    }, this)
}