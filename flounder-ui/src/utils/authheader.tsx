import cookies from "./cookies";

export default function AuthorizationHeader(){
    const currentUser = cookies.get('currentUser');
    const token = JSON.parse(currentUser ? currentUser : '')?.token || '';

    return token ? {
        'Authorization': `Bearer ${token}`,
    } : {};
}