import { userService } from "@/services";
import { useLogin } from "./useLogin";
import cookies from "@/utils/cookies";

interface User{
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    email: string,
}

export const useSignup = () => {
    const signup = async(params:User) => {
        try{
            const response = await userService.post(params)
            if(response?.username){
                cookies.set("flounder-webapp-currentUser", JSON.stringify(response))
                return {output:response, pass:true};
            }
            return {output:response, pass:false};
        }
        catch(err){
            console.log(err)
            return {output:err, pass:false};
        }
    }

    return {signup}
}