import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {Row, Col, Card, Typography, Image, Spin, Divider} from 'antd';
import dayjs from "dayjs";
import { useProblemKey } from "@/hooks/useProbemKey";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";

const {Title, Text} = Typography

export default function Problem(){
    const router = useRouter();
    const {get:get, verify:verify} = useProblemKey();
    const [key, setKey] = useState<any>(null);
    const [problemData, setProblemData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [notFound, setNotFound] = useState<boolean>(false)

    const containerRef = useRef(null)

    const {currentUser:currentUser} = useCurrentUser();

    useEffect(() => {setKey(router.query?.key)}, [router, router.query])
    useEffect(() => {fetch()}, [key, currentUser])
    //useEffect(() => {if(resultOpen){setTimeout(() => {setResultOpen(false)}, 1000)}}, [resultOpen])

    const fetch = async() => {
        if(typeof key === "string"){
            if(currentUser){
                router.push(`/problems/solve/${key}`)
            }
            setLoading(true);
            try{
                const info = await get(key)
                if(info.pass){
                    console.log(info.output)
                    setProblemData(info.output)
                }
                else{
                    if(info?.output?.response?.data?.detail === "Problem not found."){
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

    return(
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={16}>
                <Card
                    title={
                        <>
                        {!notFound && problemData &&
                            <Title level={3} className="mt-4">
                                {problemData.title} <br/>
                                <span className="text-[0.7em]">Written by: {problemData.creator}</span><br/>
                                <span className="text-[0.65em] italic font-light">Created:{" "} 
                                {dayjs(problemData.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </Title>
                        }
                        {notFound && 
                        <Title level={4} className="mt-4">
                             Cannot find this problem
                         </Title>
                        }
                        </>
                    }
                    ref={containerRef}
                    >
                        <Spin size="large" spinning={loading}>
                            {!notFound && problemData &&
                                <Col span={24}>
                                    <Row className="flex flex-col gap-4">
                                        <Text className="text-xl font-semibold">
                                            Problem <br/>
                                        </Text>
                                        <Text className="text-lg">
                                            {problemData.question}
                                        </Text>
                                        {problemData.image &&
                                        <Image
                                        className="rounded-md"
                                        alt="Problem Image"
                                        width="30%"
                                        src={`data:image/png;base64,${problemData.image}`}>

                                        </Image>
                                        }   
                                        <span className="mt-4">You are not signed in!{" "}
                                        <Link href={`/login/${key}`} className="font-bold text-sky-600 hover:text-sky-400">Log in{" "}</Link>
                                        to attempt this problem!</span>
                                    </Row>
                                </Col>    
                            }
                            {notFound && 
                            <div>
                                Problem {key ? `"${key}" `:""}does not exist.
                            </div>
                            }
                    </Spin>
                </Card>
            </Col>
        </Row>
    )
}