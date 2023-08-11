import cookies from "@/utils/cookies"
import { useRouter } from "next/router"

export const useLogout = () => {

    const logout = () => {
        cookies.remove("flounder-webapp-currentUser")
        router.push('/')
    }

    const sessionend = () => {
        cookies.remove("flounder-webapp-currentUser")
        router.push('/redirect/sessionend')
    }

    const forcelogout = () => {
        cookies.remove("flounder-webapp-currentUser")
        router.push('/redirect/signedout')
    }

    return {logout, sessionend, forcelogout}
}