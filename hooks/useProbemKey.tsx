import { problemService } from "@/services";

//problem services to find by username

export const useProblemKey = () => {
    const get = async(key:string, username?:string) => {
        try{
            const response = username ? await problemService.getKeyUser(key, username) :
            await problemService.getKey(key)
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

    const verify = async(key:string, answer:number, user:string) => {
        try{
            const response = await problemService.verify(key, {answer:answer, user:user})
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

    return {get, verify}
}