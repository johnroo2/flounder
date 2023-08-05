import {useRouter} from "next/router"
import useCurrentUser from "@/hooks/useCurrentUser";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import {Row, Col, Card, Typography, Image, Tooltip, Upload, notification} from 'antd';
import type { UploadFile, UploadProps } from "antd";
import dayjs from "dayjs";
import { CloseOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import EditProfile from "@/components/modals/EditProfile";

const {Title, Text} = Typography

export default function Profile(){
    const router = useRouter();
    const {get:get, put:put} = useProfile();
    const {currentUser:currentUser} = useCurrentUser();
    const [username, setUsername] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

    useEffect(() => {setUsername(router.query?.username)}, [router, router.query])
    useEffect(() => {fetch()}, [username])

    const fetch = async() => {
        if(typeof username === "string"){
            try{
                const info = await get(username)
                if(info.pass){
                    setUserData(info.output)
                }
                else{
                    if(info?.output?.response?.data?.detail === "User not found."){
                        setNotFound(true);
                    }
                }
            }
            catch(err){
                console.log(err);
                setNotFound(true);
            }
        }
    }

    const props: UploadProps = {
        beforeUpload: (file) => {
            const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
            const isAllowed = allowed.findIndex((item:any)=>file.type===item) > -1
            if (!isAllowed) {
                notification.open({
                    message: "Upload failed",
                    description: `${file.name} is not supported. Supported image types are
                    png, jpeg, gif`,
                    icon: <CloseOutlined style={{color: '#ff0303',}}/>
                })
            }
            return isAllowed || Upload.LIST_IGNORE;
        },
        onChange: (info) => {
          console.log(info.fileList);
        },
    };

    return(
        <>
        {!notFound && userData &&
        <Row className="base-fullheight base-flexhorizontal pt-10">
            <Col span={16}>
                <Card
                title={
                    <Title level={3} className="mt-4">
                        {`${userData.username}'s Profile`}
                        <Tooltip
                        placement="top"
                        title="Admin">
                            {userData.isAdmin ? " 😎": ""}
                        </Tooltip>
                        <Tooltip
                        placement="top"
                        title="Moderator">
                            {userData.isMod ? " 🛡️" : ""}
                        </Tooltip>
                    </Title>
                }>
                    <Row className="gap-8">
                        <Col span={6} className="flex flex-col gap-6">
                            <Image
                            width={"100%"}
                            src={'/flounder.png'}
                            />
                            {(currentUser && currentUser?.username === username) && 
                            <Upload maxCount={1} {...props}>
                                <span className="flex flex-row gap-2 text-sky-600 hover:text-sky-400
                                    transition-all duration-300 items-center">
                                    <UploadOutlined/> 
                                    Change Profile Picture
                                </span>
                            </Upload>}
                            <Col className="flex flex-col gap-2">
                                <Text><b>Name:</b> {`${userData.firstname} ${userData.lastname}`}</Text>
                                <Text><b>Email:</b> {`${userData.email}`}</Text>
                                <Text><b>Joined:</b> {`${dayjs(userData.createdAt).format('YYYY-MM-DD')}`}</Text>
                                <Text><b>Points:</b> {`${userData.points}`}</Text>
                            </Col>
                        </Col>
                        <Col span={16} className="flex flex-col gap-2">
                            <Row className="flex items-center gap-2">
                                <Title level={4}>About</Title>
                                {(currentUser && currentUser?.username === username) && 
                                <EditOutlined 
                                className="text-lg mb-4 text-sky-600 
                                hover:text-sky-400 transition-all duration-300"
                                onClick={() => {setEditModalOpen(true)}}/>}
                            </Row>
                            <Text>{userData.about}</Text>   
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        }
        {notFound && 
        <Row className="base-fullheight base-flexhorizontal pt-10">
            <Col span={16}>
                <Card
                title={
                    <Title level={4} className="mt-4">
                        {`Cannot find this user`}
                    </Title>
                }>
                    Profile {username ? `"${username}" `:""}does not exist.
                </Card>
            </Col>
        </Row>
        }
        <EditProfile
        open={editModalOpen}
        close={() => {setEditModalOpen(false)}}
        refreshData={fetch}
        put={put}
        details={userData}
        />
        </>
    )
}