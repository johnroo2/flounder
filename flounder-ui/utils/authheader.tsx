import cookies from "./cookies";

export default function AuthorizationHeader(){
    const currentUser = cookies.get('currentUser');
    if(currentUser){
        const token = JSON.parse(currentUser)?.token || '';

        return token ? 
        {
            headers: {'Authorization': `Bearer ${token}`,}
        }
        : undefined;
    }
    return undefined;
}