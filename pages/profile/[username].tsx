import {useRouter} from "next/router"
import useCurrentUser from "@/hooks/useCurrentUser";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import {Row, Col, Card, Typography, Image, Tooltip, Spin, Select} from 'antd';
import dayjs from "dayjs";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import EditProfile from "@/components/modals/EditProfile";
import FullUpload from "@/components/misc/FullUpload";
import PointsChart from "@/components/chart/PointsChart";
import type { Mode } from '@/types/Mode';
import { modeOptions } from '@/types/Mode';

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
    const [mode, setMode] = useState<Mode>("Last 28 Days")

    useEffect(() => {setUsername(router.query?.username)}, [router, router.query])
    useEffect(() => {fetch()}, [username])

    const fetch = async() => {
        if(typeof username === "string"){
            setLoading(true);
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

    const handleSubmit = async(formData:FormData) => {
        await put(username, formData);
        await fetch();
    }

    return(
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={22}>
                <Card
                    title={
                        <>
                        {!notFound && userData &&
                            <Title level={3} className="mt-4">
                                {`${userData.username}'s Profile`}
                                <Tooltip
                                color="#0369a1" 
                                placement="top"
                                title="Admin">
                                    {userData.isAdmin ? " 😎": ""}
                                </Tooltip>
                                <Tooltip
                                color="#0369a1" 
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
                    className={`${loading ? `h-[50%]` : ''}`}>
                        <Spin size="large" spinning={loading}>
                            {!notFound && userData &&
                                
                                    <Row className="gap-8">
                                        <Col span={3} className="flex flex-col gap-6">
                                            <Image
                                            alt={"Profile Image"}
                                            width={"100%"}
                                            className="rounded-md"
                                            src={userData.image ? `data:image/png;base64,${userData.image}` : "/flounder.png"}
                                            />
                                            {(currentUser && currentUser?.username === username) && 
                                            <FullUpload 
                                            render={
                                                <span className="flex flex-row gap-2 text-sky-600 hover:text-sky-400
                                                    transition-all duration-300 items-center">
                                                    <UploadOutlined/> 
                                                    Change Profile Picture
                                                </span>
                                            } 
                                            onSubmit={(formData) => {
                                                handleSubmit(formData);
                                            }}/>}
                                            <Col className="flex flex-col gap-2">
                                                <Text><b>Name:</b> {`${userData.firstname} ${userData.lastname}`}</Text>
                                                <Text><b>Joined:</b> {`${dayjs(userData.createdAt).format('YYYY-MM-DD')}`}</Text>
                                                <Text><b>Points:</b> {`${userData.points}`}</Text>
                                                <Text><b>Solves:</b> {`${userData.history.length-1}`}</Text>
                                            </Col>
                                        </Col>
                                        <Col span={9} className="flex flex-col gap-2">
                                            <Row className="flex items-center gap-2">
                                                <Title level={4}>About</Title>
                                                {(currentUser && currentUser?.username === username) && 
                                                <EditOutlined 
                                                className="text-lg mb-4 text-sky-600 
                                                hover:text-sky-400 transition-all duration-300"
                                                onClick={() => {setEditModalOpen(true)}}/>}
                                            </Row>
                                            {userData.about ? <Text>{userData.about}</Text> :
                                            <Text>
                                            Just flounderin&apos; about without a bio 🎣✨ <br/> 
                                            <span className="italic">(This is the default bio)</span>
                                            </Text>}
                                        </Col>
                                        <Col span={10} className="flex flex-col">
                                        <Row className="flex flex-row gap-10 items-center justify-between">
                                            <Title level={4}>
                                            {userData.username}&apos;s Points <br/>
                                            <span className="text-[0.7em]">
                                                {userData.points >= 0 ? `Total Points: ${userData.points}` : "Fetching Points..."}
                                            </span>
                                            </Title>
                                            <Select
                                            value={mode}
                                            className="min-w-[12em]"
                                            onSelect={(value:Mode) => {setMode(value)}}
                                            onClear={() => {setMode("Last 28 Days")}}>
                                            {modeOptions.map((item:string, key:number)=>
                                            <Select.Option value={item} key={key}>
                                                {item}
                                            </Select.Option>)}
                                            </Select>
                                        </Row>
                                            <PointsChart userData={userData} mode={mode}/>
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