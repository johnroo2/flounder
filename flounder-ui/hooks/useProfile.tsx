import { profileService, pointService } from "@/services";

//profile services to find by username

export const useProfile = () => {
    const get = async(username:string) => {
        try{
            const responseProfile = await profileService.get(username)
            const responsePoint = await pointService.get(username)
            if(responseProfile && responsePoint){
                return {output:{...responseProfile, ...responsePoint}, pass:true};
            }
            return {output:{...responseProfile, ...responsePoint}, pass:false};
        }
        catch(err){
            console.log(err)
            return {output:err, pass:false};
        }
    }

    const put = async(username:string, params:any) => {
        try{
            const response = await profileService.put(username, params)
            if(response){
                return {output:response, pass:true};
            }
            return {output:response, pass:false};
        }
        catch(err){
            console.log(err)
            return {output:err, pass:false};
        }
    }

    return {get, put}
}