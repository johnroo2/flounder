import { authService } from "@/services";
import cookies from "@/utils/cookies";

export const useLogin = () => {
    const login = async(username:string, password:string) => {
        try{
            const response = await authService.login(username, password)
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

    return {login}
}