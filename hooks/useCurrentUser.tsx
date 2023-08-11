import cookies from "@/utils/cookies";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const useCurrentUser = () => {

    const router = useRouter();

    const fetch = async() => {
        const response = await cookies.get('flounder-webapp-currentUser')
        return response ? JSON.parse(response) : null;
    }

    const [currentUser, setCurrentUser] = useState<any>(fetch())
    
    useEffect(() => {
        setfetch()
    }, [cookies, cookies.cookies['flounder-webapp-currentUser'], router.asPath])

    const setfetch = async() => {
        const response = await cookies.get('flounder-webapp-currentUser')
        setCurrentUser(response ? JSON.parse(response) : null)
    }

    return {currentUser}
}

export default useCurrentUser;