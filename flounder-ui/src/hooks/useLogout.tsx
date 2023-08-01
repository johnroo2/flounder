import cookies from "@/utils/cookies"
import router from "next/router"

const useLogout = () => {
    const logout = () => {
        cookies.remove("currentUser")
        router.push('/redirect/logout')
    }

    const sessionend = () => {
        cookies.remove("currentUser")
        router.push('/redirect/sessionend')
    }

    const forcelogout = () => {
        cookies.remove("currentUser")
        router.push('/redirect/signedout')
    }

    return {logout, sessionend, forcelogout}
}

export default useLogout;