import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {Row, Col, Card, Typography, Tooltip, Image, Spin, Button, Divider, Result} from 'antd';
import dayjs from "dayjs";
import { useProblemKey } from "@/hooks/useProbemKey";
import useCurrentUser from "@/hooks/useCurrentUser";
import { CheckCircleTwoTone, CloseCircleTwoTone, DownOutlined, InfoCircleTwoTone, UpOutlined } from "@ant-design/icons";

const {Title, Text} = Typography

export default function Problem(){
    const router = useRouter();
    const {get:get, verify:verify} = useProblemKey();
    const [key, setKey] = useState<any>(null);
    const [problemData, setProblemData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [notFound, setNotFound] = useState<boolean>(false)
    const [answerState, setAnswerState] = useState<number>(-1);
    const [solveState, setSolveState] = useState<{pass:boolean, attempt:Boolean, answer:any, solution:string}>
        ({pass:false, attempt:false, answer:"", solution:""})
    const [solutionOpen, setSolutionOpen] = useState<boolean>(false);
    const [availablePoints, setAvailablePoints] = useState<number | null>(null);
    const [resultOpen, setResultOpen] = useState<boolean>(false)

    const containerRef = useRef(null)

    const {currentUser:currentUser} = useCurrentUser();

    useEffect(() => {setKey(router.query?.key)}, [router, router.query])
    useEffect(() => {fetch()}, [key, currentUser, solveState])
    //useEffect(() => {if(resultOpen){setTimeout(() => {setResultOpen(false)}, 1000)}}, [resultOpen])

    const fetch = async() => {
        if(typeof key === "string" && currentUser){
            setLoading(true);
            try{
                const info = await get(key, currentUser.username)
                if(info.pass){
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

    const calcPoints = (calcData:any) => {
        const base = calcData.value;
        const fresh = calcData.fresh;
        if(!fresh){
            return 0;
        }
        else{
            return base
        }
    }

    useEffect(() => {if(problemData){(setAvailablePoints(calcPoints(problemData)))}}, [problemData])

    const handleAnswer = async(answer:number, user:string) => {
        try{
            const response = await verify(key, answer, user)
            if(response.pass){
                if(response.output.pass === "correct"){
                    setSolveState({...{pass:true, attempt: true, answer:response.output.answer, solution:response.output.solution}})
                }
                else{
                    setSolveState({...{pass:false, attempt: true, answer:response.output.answer, solution:response.output.solution}})
                }
                setResultOpen(true);
            }
        }
        catch(err){
            console.log(err)
            alert("error!")
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
                    className={`h-[calc(100vh_-_64px_-_2rem)] overflow-y-scroll`}>
                        <Spin size="large" spinning={loading}>
                            {!notFound && problemData &&
                                <Col span={24}>
                                    <Row className="flex flex-col gap-4">
                                        <Text className="text-xl font-semibold">
                                            Problem
                                        </Text>
                                        <Text className="text-lg">
                                            {problemData.question}
                                        </Text>
                                        {problemData.image &&
                                        <Image
                                        width="30%"
                                        src={`data:image/png;base64,${problemData.image}`}>

                                        </Image>
                                        }       
                                        <Divider/>       
                                        {resultOpen ? 
                                            <Result
                                            status={solveState.pass ? "success" : "error"}>
                                                <Row className="flex flex-col gap-8 items-center justify-center">
                                                    {solveState.pass ?
                                                    <div className="text-center">
                                                    Your answer was correct! <br/>
                                                    Congrats {":)"}
                                                    </div>
                                                    :
                                                    <div className="text-center">
                                                    Sorry, your answer is incorrect. <br/>
                                                    The correct answer was <span className="font-bold">{solveState.answer}</span>.
                                                    </div>}
                                                    <Row className="flex flex-row gap-4">
                                                        <Button
                                                        type="primary"
                                                        className="bg-sky-600"
                                                        onClick={() => {setResultOpen(false)}}>
                                                            Continue
                                                        </Button>
                                                        <Button
                                                        type="primary"
                                                        ghost
                                                        onClick={() => {
                                                            setResultOpen(false)
                                                            setSolutionOpen(true)
                                                        }}>
                                                            Learn More
                                                        </Button>
                                                    </Row>
                                                </Row>
                                            </Result> 
                                        :
                                        <>         
                                            <Text className="text-xl font-semibold flex flex-row gap-2 items-center">
                                                Available Points: {availablePoints}
                                                <Tooltip color="#0369a1" 
                                                title={!availablePoints ? "You've already attempted this problem!" : 
                                                `There are ${availablePoints} to be claimed if you get it right!`}> 
                                                    <InfoCircleTwoTone/>
                                                </Tooltip>
                                            </Text>
                                            {problemData.options.map((item:string, key:number) => 
                                                <div key={key} className={`answerbox${answerState == key ? " answerbox-selected" : ""}`} 
                                                onClick={() => {
                                                    if(!solveState.pass){
                                                        if(answerState !== key){
                                                            setAnswerState(key)
                                                        }
                                                        else{
                                                            setAnswerState(-1)
                                                        }
                                                    }
                                                }}>
                                                    {item}
                                                </div>
                                            )}
                                            {!solveState.solution ?
                                            <Button
                                            type="primary"
                                            size="large"
                                            disabled={!(answerState > -1 && answerState < problemData.options.length)}
                                            className="bg-sky-700 mt-4 self-start"
                                            onClick={() => {handleAnswer(answerState, currentUser.username)}}>
                                                <span>Submit Answer</span>
                                            </Button>
                                            :
                                            <>
                                            <Row className="flex flex-row items-center">
                                                <Button
                                                type="primary"
                                                size="large"
                                                disabled
                                                className="bg-sky-700 mt-4 self-start"
                                                onClick={() => {handleAnswer(answerState, currentUser.username)}}>
                                                    <span>Submit Answer</span>
                                                </Button>
                                                {solveState.pass ? 
                                                <Tooltip color="#0369a1" title={"Correct"}>
                                                    <CheckCircleTwoTone className="text-[1.5em] mt-4 p-2" twoToneColor="#4ade80"/>
                                                </Tooltip> 
                                                :
                                                <Tooltip color="#0369a1" title={"Incorrect"}>
                                                    <CloseCircleTwoTone className="text-[1.5em] mt-4 p-2" twoToneColor="#ef4444"/>
                                                </Tooltip>
                                                }
                                                <Button
                                                type="primary"
                                                size="large"
                                                disabled={!solveState.solution}
                                                className="bg-sky-700 mt-4 self-start ml-4 flex flex-row gap-1 items-center"
                                                onClick={() => {setSolutionOpen(!solutionOpen)}}>
                                                    {solutionOpen ? <UpOutlined/> : <DownOutlined/>}
                                                    <span>{solutionOpen ? "Close Solution" : "View Solution"}</span>
                                                </Button>
                                            </Row>
                                            </>
                                            }  
                                            </>  
                                        } 
                                        <Divider/>   
                                        {solutionOpen && 
                                            <>
                                            <Text className="text-xl font-semibold">
                                                Solution
                                            </Text>
                                            <Text className="text-lg">
                                                {solveState.solution}
                                            </Text>
                                            <Text className="text-lg italic">
                                                {(() => {
                                                    if(problemData.attempts > 0){
                                                        return ((100*problemData.solvers)/problemData.attempts).toFixed(0);
                                                    }
                                                    else{
                                                        return 0;
                                                    }
                                                })()}% of users solved this problem!
                                            </Text>
                                            </>
                                        }
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