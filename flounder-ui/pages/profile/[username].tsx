import {useRouter} from "next/router"
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import {Row, Col, Card, Typography, Image, Divider} from 'antd';
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";

const {Title, Text} = Typography

export default function Profile(){
    const router = useRouter();
    const {profile:profile} = useProfile();
    const [username, setUsername] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {setUsername(router.query?.username)}, [router, router.query])
    useEffect(() => {fetch()}, [username])

    const fetch = async() => {
        try{
            const info = await profile(username)
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
        }
    }

    return(
        <>
        {!notFound && userData &&
        <Row className="base-fullheight base-flexhorizontal pt-10">
            <Col span={20}>
                <Card
                title={
                    <Title level={3} className="mt-4">
                        {`${userData.username}'s Profile`}
                    </Title>
                }>
                    <Row className="gap-8">
                        <Col span={4} className="flex flex-col gap-6">
                            <Image
                            width={"100%"}
                            src={"/flounder.png"}
                            />
                            <Col className="flex flex-col gap-2">
                                <Text>{`Name: ${userData.name}`}</Text>
                                <Text>{`Email: ${userData.email}`}</Text>
                                <Text>{`Joined: ${dayjs(userData.createdAt).format('YYYY-MM-DD')}`}</Text>
                                <Text>{`Points: ${userData.points}`}</Text>
                            </Col>
                        </Col>
                        <Col span={12} className="flex flex-col gap-2">
                            <Row className="flex items-center gap-2">
                                <Title level={4}>About</Title>
                                <EditOutlined className="text-lg mb-4 text-sky-600 
                                hover:text-sky-400 transition-all duration-300"/>
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
            <Col span={20}>
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
        </>
    )
}