import { Typography, Button, Col, Dropdown, MenuProps, Switch, Row, Tooltip} from "antd"
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { useState } from "react";
import { PolyWave } from "./Waves";
import { useRouter } from "next/router";
import cookies from "@/utils/cookies";

const {Title, Text} = Typography

const Navbar = () => {
    const {currentUser:currentUser} = useCurrentUser();
    const [waveState, setWaveState] = useState<boolean>(true);
    const router = useRouter()

    const items: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <div className="navbar-menu">
                <Text onClick={() => {router.push(`/profile/${currentUser.username}`)}} className="text-black hover:text-600">
                    Profile
                </Text>
                </div>
            )
        },
        currentUser && (currentUser.isAdmin || currentUser.isMod) && {
            key: '2',
            type: "group",
            label: 'Admin',
            children: [
                {
                    key: '2-1',
                    label: (
                        <div className="navbar-menu">
                        <Text onClick={() => {router.push('/settings/users')}} className="text-black hover:text-600">
                            {">"} Users
                        </Text>
                        </div>
                    )
                },
                {
                    key: '2-2',
                    label: (
                        <div className="navbar-menu">
                        <Text onClick={() => {router.push('/settings/problems')}} className="text-black hover:text-600">
                            {">"} Problems
                        </Text>
                        </div>
                    )
                },
            ],
        },
        {
            key: '1',
            label: (
                <div className="navbar-menu">
                <Text onClick={() => {
                    router.push('/')
                    cookies.remove("flounder-webapp-currentUser")
                }} className="text-black hover:text-600">
                    Logout
                </Text>
                </div>
            )
        },
    ];

    return(
        <nav className="z-50">
        {waveState && <PolyWave/>}
        <div className="flex flex-row w-screen h-[64px] bg-sky-600 items-center px-4 justify-between">
            <Col>
                <Row className="flex flex-row gap-12 items-center">
                    <Title level={3} className="items-center justify-center mt-2">
                        <Link href={"/"}>
                            <span className="text-white hover:text-white">
                                🐟 Flounder
                            </span>
                        </Link>
                    </Title>
                    <Row className="flex flex-row gap-8 items-center">
                        {currentUser && 
                         <Link
                         href={`/`}>
                             <Text 
                             className="text-white">
                                 Dashboard
                             </Text>
                         </Link>}
                         {currentUser && 
                        <Link
                        href={`/profile/${currentUser.username}`}>
                            <Text
                            className="text-white">
                                Profile
                            </Text>
                        </Link>}
                        <Link
                        href={`/problems`}>
                            <Text
                            className="text-white">
                                Problems
                            </Text>
                        </Link>
                        <Link
                        href={`/users`}>
                            <Text
                            className="text-white">
                                Users
                            </Text>
                        </Link>               
                        <Link
                        href={`/about`}>
                            <Text
                            className="text-white">
                                About
                            </Text>
                        </Link>
                    </Row>
                </Row>
            </Col>
            

            <Col className="mr-4">
                <Row className="flex flex-row gap-8 items-center">
                    <Row className="flex flex-row gap-2">
                        <span className="text-white">Waves:</span>
                        <Switch defaultChecked={true} onChange={(value:any)=>{setWaveState(value)}} 
                        style={{backgroundColor: waveState ? '#075985' : '#1e293b'}}
                        checkedChildren="On" unCheckedChildren="Off" />
                    </Row>
                    {currentUser && (currentUser.isAdmin || currentUser.isMod) &&
                    <Tooltip color="#0369a1" title="Admin" placement="bottom">
                    <Link href={'/settings'}>
                        <SettingOutlined className="text-white text-[1.75em]"/>
                    </Link>
                    </Tooltip>}
                        {currentUser ?                   
                        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                            <div className="flex flex-row gap-3 bg-sky-500 items-center justify-center text-white rounded-full p-2">
                                <UserOutlined className="text-white text-[1.5em]"/> 
                                {currentUser.username}
                            </div>
                        </Dropdown>                     
                        : 
                        <Button
                        type="primary"
                        href="/login"
                        className="bg-sky-500">
                            Login
                        </Button>
                        }
                </Row>
            </Col>
        </div>
        </nav>
    )
}

export default Navbar