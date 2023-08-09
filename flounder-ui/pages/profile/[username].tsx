import {useRouter} from "next/router"
import useCurrentUser from "@/hooks/useCurrentUser";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import {Row, Col, Card, Typography, Image, Tooltip, Upload, notification, Spin} from 'antd';
import type { UploadProps } from "antd";
import dayjs from "dayjs";
import { CloseOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import EditProfile from "@/components/modals/EditProfile";
import { RcFile } from "antd/es/upload";

const {Title, Text} = Typography

export default function Profile(){
    const router = useRouter();
    const {get:get, put:put} = useProfile();
    const {currentUser:currentUser} = useCurrentUser();
    const [username, setUsername] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {setUsername(router.query?.username)}, [router, router.query])
    useEffect(() => {fetch()}, [username])

    const fetch = async() => {
        setLoading(true);
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
                setLoading(false)
            }
            catch(err){
                console.log(err);
                setNotFound(true);
                setLoading(false)
            }
        }
    }

    const handleImageChange = async(image:string) => {
        try{
            console.log(image.length)
            const byteCharacters = atob(image.split(',')[1]);
            const byteArrays = [];
            for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('image', blob, 'image.jpg');
            await put(username, formData)
            await fetch();
        }
        catch(err){
            console.log(err);
        }
    }

    const props: UploadProps = {
        beforeUpload: (file) => {
            const allowed = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
            console.log(file.type)
            const isAllowed = allowed.findIndex((item:any)=>file.type===item) > -1
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                notification.open({
                    message: "Upload failed",
                    description: `Your file is too large! Your image: 
                    ${(file.size / (1024*1024)).toFixed(2)}MB. (Upload Limit: 5MB)`,
                    icon: <CloseOutlined style={{color: '#ff0303',}}/>
                })
                return false;
            }
            if (!isAllowed) {
                notification.open({
                    message: "Upload failed",
                    description: `${file.name} of type ${file.type} is not supported. Supported image types are
                    png, jpg, jpeg, gif.`,
                    icon: <CloseOutlined style={{color: '#ff0303',}}/>
                })
            }
            return isAllowed || Upload.LIST_IGNORE;
        },
        onChange: (info: any) => {
            try{
                const file: RcFile = info?.fileList[0]?.originFileObj;
                if(info?.file?.error){
                    notification.open({
                        message: "Upload failed",
                        description: `Internal Server Error.`,
                        icon: <CloseOutlined style={{color: '#ff0303',}}/>
                    })
                }
        
                if (info?.fileList[0]?.status === "done") {
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const imageDataUrl = reader.result as string;
                            handleImageChange(imageDataUrl);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
            catch(err){
                console.log(err);
            }
        },
        maxCount:1,
        showUploadList:false
    };

    return(
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={16}>
                <Card
                    title={
                        <>
                        {!notFound && userData &&
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
                        }
                        {notFound && 
                        <Title level={4} className="mt-4">
                             Cannot find this user
                         </Title>
                        }
                        </>
                    }
                    className={loading ? `h-[50%]` : ''}>
                        <Spin size="large" spinning={loading}>
                            {!notFound && userData &&
                                
                                    <Row className="gap-8">
                                        <Col span={6} className="flex flex-col gap-6">
                                            <Image
                                            width={"100%"}
                                            src={userData.image ? `data:image/png;base64,${userData.image}` : "/flounder.png"}
                                            />
                                            {(currentUser && currentUser?.username === username) && 
                                            <Upload {...props}>
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
                            }
                            {notFound && 
                            <div>
                                Profile {username ? `"${username}" `:""}does not exist.
                            </div>
                            }
                    </Spin>
                </Card>
                <EditProfile
                open={editModalOpen}
                close={() => {setEditModalOpen(false)}}
                refreshData={fetch}
                put={put}
                details={userData}/>
            </Col>
        </Row>
    )
}