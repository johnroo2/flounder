import cookies from "@/utils/cookies"
import router from "next/router"

const useLogout = () => {
    const logout = () => {
        cookies.remove("currentUser")
        router.push('/')
    }

    return {logout}
}

export default useLogout;