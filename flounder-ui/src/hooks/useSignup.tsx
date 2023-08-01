import { userService } from "@/services";

interface User{
    username: string,
    password: string
}

const useSignup = () => {
    const signup = async(params:User) => {
        try{
            const response = await userService.post(params)
            if(response){
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

export default useSignup;