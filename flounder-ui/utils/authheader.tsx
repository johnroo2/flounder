import cookies from "./cookies";

export default function AuthorizationHeader(){
    const currentUser = cookies.get('flounder-webapp-currentUser');
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