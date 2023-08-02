import { authService } from "@/services";
import cookies from "@/utils/cookies";

export const useLogin = () => {
    const login = async(username:string, password:string) => {
        try{
            const response = await authService.login(username, password)
            if(response){
                cookies.set("flounder-webapp-currentUser", JSON.stringify(response))
                console.log(response);
            }
            return {output:response, pass:true};
        }
        catch(err){
            console.log(err)
            return {output:err, pass:false};
        }
    }

    return {login}
}