import { Typography } from "antd"

const {Title} = Typography

export default function Navbar(){
    return(
        <div className="flex flex-row w-screen h-[64px] bg-sky-600 items-center px-4">
            <Title level={3} className="mt-4">
                <span className="text-white">🐟 Flounder</span>
            </Title>
        </div>
    )
}