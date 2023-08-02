import { Typography, Button } from "antd"
import { useLogout } from "@/hooks/useLogout"

const {Title} = Typography

const Navbar = () => {

    const {logout:logout} = useLogout();

    return(
        <div className="flex flex-row w-screen h-[64px] bg-sky-600 items-center px-4 justify-between">
            <Title level={3} className="mt-4">
                <span className="text-white">🐟 Flounder</span>
            </Title>
            <Button
            onClick={() => {logout()}}
            className="bg-sky-800"
            type="primary">
                Logout
            </Button>
        </div>
    )
}

export default Navbar