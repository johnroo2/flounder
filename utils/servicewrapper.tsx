import router from "next/router"
import cookies from "./cookies";

//wrapper if user exists and back end call
export default function servicewrapper(method:(...args:any[]) => Promise<any>, context:any){

    return async(...args:any[]) => {
        try{
            const response = await method.call(context, ...args).then((value:any) => value, 
            (err:any) => {handleErr(err); throw err})
            return response;
        }
        catch(err){
            console.log(err)
            throw err;
        }
    }
}

const handleErr = (err:any) => {
    if(err?.response?.data?.detail === "Invalid token."){
        cookies.remove("flounder-webapp-currentUser")
        router.push('/redirect/sessionend')
    }
}