import cookies from "./cookies";

export default function AuthorizationHeader(params?:any){
    const currentUser = cookies.get('flounder-webapp-currentUser');
    if(currentUser){
        const token = JSON.parse(currentUser)?.token || '';

        return token ? 
        {
            params: params ? params : undefined,
            headers: {'Authorization': `Bearer ${token}`,}
        }
        : undefined;
    }
    return undefined;
}