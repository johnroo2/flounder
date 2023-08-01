import cookies from "./cookies"
import useLogout from "@/hooks/useLogout";

const {logout:logout} = useLogout();

//wrapper if user exists and back end call
export default function servicewrapper(method:(...args:any[]) => Promise<any>, context:any){
    return async(...args:any[]) => {
        if(cookies.get('currentUser')){
            const response = await method.call(context, ...args).then((value:any) => value, 
            (err:any) => {handleErr(err); throw err})
            return response;
        }
    }
}

const handleErr = (err:any) => {
    if(err?.response?.data?.detail === "Invalid token."){
        //handle no auth
        //for now, sign out user and redirect to home
        logout();
    }
}