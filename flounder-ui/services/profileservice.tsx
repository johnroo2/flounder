import axios, { AxiosInstance} from 'axios';
import AuthorizationHeader from '@/utils/authheader';

export class ProfileService{
    protected readonly instance:AxiosInstance;

    constructor(url:string){
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!"
        })
    }

    profile = async(username:string) => {
        return this.instance.get(`api/profile/${username}/`, AuthorizationHeader()).then((res) => res.data)
    }
}