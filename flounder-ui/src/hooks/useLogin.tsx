import { authService } from "@/services";
import cookies from "@/utils/cookies";

const useLogin = () => {
    const login = async(username:string, password:string) => {
        try{
            const response = await authService.login(username, password)
            if(response){
                cookies.set("currentUser", JSON.stringify(response))
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

export default useLogin;