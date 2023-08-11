import servicewrapper from '@/utils/servicewrapper';
import axios, { AxiosInstance} from 'axios';
//import https from 'https'

export class AuthService{
    protected readonly instance:AxiosInstance;

    constructor(url:string){
        this.instance = axios.create({
            // httpsAgent: new https.Agent({  
            //     rejectUnauthorized: false
            //   }),
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!"
        })
    }

    login = servicewrapper(async(username:string, password:string) => {
        return this.instance.post(
            `api/login/`, {username:username, password:password}
        ).then((res) => res.data)
    }, this)
}