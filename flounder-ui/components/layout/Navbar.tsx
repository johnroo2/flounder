import { Typography, Button, Col, Dropdown, MenuProps} from "antd"
import { useLogout } from "@/hooks/useLogout"
import { UserOutlined } from "@ant-design/icons";
import useCurrentUser from "@/hooks/useCurrentUser";

const {Title, Text} = Typography

const Navbar = () => {

    const {logout:logout} = useLogout();
    const {currentUser:currentUser} = useCurrentUser();

    const items: MenuProps['items'] = [
        {
          key: '0',
          label: (
            <>
            {currentUser ? 
                <Col className="flex flex-col p-2 bg-white/[0.5] gap-4">
                    <Text className="text-center">
                        {currentUser.firstname} {currentUser.lastname}
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
        <div className="flex flex-row w-screen h-[64px] bg-sky-600 items-center px-4 justify-between">
            <Title level={3} className="mt-4">
                <span className="text-white">🐟 Flounder</span>
            </Title>

            <Dropdown menu={{ items }} trigger={["click"]}>
                <UserOutlined className="text-white text-[1.75em] mr-4"/>
            </Dropdown>
        </div>
    )
}

export default Navbar