import { userService } from "@/services";
import { useLogin } from "./useLogin";

interface User{
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    email: string,
}

export const useSignup = () => {
    const {login:login} = useLogin();

    const signup = async(params:User) => {
        try{
            const response = await userService.post(params)
            console.log(response);
            if(response){
                login(response.username, response.password)
                return {output:response, pass:true}
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