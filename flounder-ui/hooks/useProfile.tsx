import { profileService } from "@/services";

export const useProfile = () => {
    const profile = async(username:string) => {
        try{
            if(typeof username === "string"){
                const response = await profileService.profile(username)
                if(response){
                    return {output:response, pass:true};
                }
                return {output:response, pass:false};
            }
            else{
                return {output:undefined, pass:false};
            }
        }
        catch(err){
            console.log(err)
            return {output:err, pass:false};
        }
    }

    return {profile}
}