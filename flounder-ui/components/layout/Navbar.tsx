import { Typography, Button, Col, Dropdown, MenuProps, Switch, Row} from "antd"
import { useLogout } from "@/hooks/useLogout"
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { useState } from "react";
import { PolyWave } from "./wave/Waves";

const {Title, Text} = Typography

const Navbar = () => {

    const {logout:logout} = useLogout();
    const {currentUser:currentUser} = useCurrentUser();
    const [waveState, setWaveState] = useState<boolean>(true);

    const items: MenuProps['items'] = [
        {
          key: '0',
          label: (
            <>
            {currentUser ? 
                <Col className="flex flex-col p-2 bg-white/[0.5] gap-4">
                    <Text className="text-center">
                        {currentUser.username}
                    </Text>
                    <Button
                    type="primary"
                    className="bg-sky-600"
                    href={`/profile/${currentUser.username}`}>
                        Profile
                    </Button>
                    <Button
                    type="primary"
                    danger
                    onClick={logout}>
                        Logout
                    </Button>
                </Col>
            :
                <Col className="flex flex-col p-2 bg-white/[0.5] gap-4">
                    <Text>
                        You are not signed in!
                    </Text>
                    <Button
                    type="primary"
                    href="/login"
                    className="bg-sky-600">
                        Login
                    </Button>
                </Col>
            }
            </>
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
                        <Link href="/">
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
                <Row className="flex flex-row gap-8">
                    <Row className="flex flex-row gap-2">
                        <span className="text-white">Waves:</span>
                        <Switch defaultChecked={true} onChange={(value:any)=>{setWaveState(value)}} 
                        style={{backgroundColor: waveState ? '#075985' : '#1e293b'}}
                        checkedChildren="On" unCheckedChildren="Off" />
                    </Row>
                    {currentUser && (currentUser.isAdmin || currentUser.isMod) &&
                    <Link href={'/settings'}>
                        <SettingOutlined className="text-white text-[1.75em]"/>
                    </Link>}
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <UserOutlined className="text-white text-[1.75em]"/>
                    </Dropdown>
                </Row>
            </Col>
        </div>
        </nav>
    )
}

export default Navbar