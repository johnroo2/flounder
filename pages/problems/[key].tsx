import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import {Row, Col, Card, Typography, Tooltip, Image, Spin, Button, Divider, Result} from 'antd';
import dayjs from "dayjs";
import { useProblemKey } from "@/hooks/useProbemKey";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useProblemVote } from "@/hooks/useProblemVote";
import { LikeFilled, DislikeFilled, LikeOutlined, DislikeOutlined,
    CheckCircleTwoTone, CloseCircleTwoTone, DownOutlined, InfoCircleTwoTone, UpOutlined } from "@ant-design/icons";
import Link from "next/link";

const {Title, Text} = Typography

export default function Problem(){
    const router = useRouter();
    const {get:get, verify:verify} = useProblemKey();
    const {like:like, dislike:dislike, neutral:neutral} = useProblemVote();

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
        if(typeof key === "string"){
            setLoading(true);
            try{
                const info = currentUser ? await get(key, currentUser.username) : await get(key)
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
        else{
            if(!currentUser){
                router.replace(`/problems/${key}`)
            }
        }
    }

    const handleLike = async() => {
        if(currentUser && problemData){
            setLoading(true);
            try{
                await like(currentUser.id, problemData.id);
                await fetch()
                setLoading(false);
            }
            catch(err){
                console.log(err)
                setLoading(false);
            }
        }
    }

    const handleDislike = async() => {
        if(currentUser && problemData){
            setLoading(true);
            try{
                await dislike(currentUser.id, problemData.id);
                await fetch()
                setLoading(false);
            }
            catch(err){
                console.log(err)
                setLoading(false);
            }
        }
    }

    const handleNeutral = async() => {
        if(currentUser && problemData){
            setLoading(true);
            try{
                await neutral(currentUser.id, problemData.id);
                await fetch()
                setLoading(false);
            }
            catch(err){
                console.log(err)
                setLoading(false);
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
        <>
        {currentUser ?
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={16}>
                <Card
                    title={
                        <>
                        {!notFound && problemData &&
                            <Row className="flex flex-row justify-between items-center">
                                <Title level={3} className="mt-4">
                                    {problemData.title} <br/>
                                    <span className="text-[0.7em]">Written by: {problemData.creator}</span><br/>
                                    <span className="text-[0.65em] italic font-light">Created:{" "} 
                                    {dayjs(problemData.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                                </Title>
                                <Row className="flex flex-row mt-4 mr-12 gap-2 items-center h-min
                                text-sky-700 bg-sky-100 py-1 px-3 rounded-full">
                                    <span className="flex place-items-center text-[1.5em]"
                                    onClick={() => {problemData.selfvoted === "upvote" ? handleNeutral() : handleLike()}}>
                                        <Tooltip color="#0369a1" 
                                        title={problemData.selfvoted === "upvote" ? "Remove vote" : "Upvote"}>
                                            {problemData.selfvoted === "upvote" ? <LikeFilled/> : <LikeOutlined/>}
                                        </Tooltip>
                                    </span>
                                    <span className="flex place-items-center text-[1.25em]">
                                        Vote
                                        <div className="bg-sky-200 rounded-full ml-1 p-1">
                                            <span className="px-1">
                                            {problemData.likes - problemData.dislikes}
                                            </span>
                                        </div>
                                    </span>
                                    <span className="flex place-items-center text-[1.5em]"
                                    onClick={() => {problemData.selfvoted === "downvote" ? handleNeutral() : handleDislike()}}>
                                        <Tooltip color="#0369a1"
                                        title={problemData.selfvoted === "downvote" ? "Remove vote" : "Downvote"}>
                                            {problemData.selfvoted === "downvote" ? <DislikeFilled/> : <DislikeOutlined/>}
                                        </Tooltip>
                                    </span>
                                </Row>
                            </Row>
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
                                                title={!availablePoints ? `${problemData.selfsolved ? 
                                                    "You've already solved and earned points from this question!" : 
                                                    "You've already attempted this question!"}` : 
                                                `There are ${availablePoints} points to be claimed if you get it right!`}> 
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
        :
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={16}>
                <Card
                    title={
                        <>
                        {!notFound && problemData &&
                            <Row className="flex flex-row justify-between items-center">
                            <Title level={3} className="mt-4">
                                {problemData.title} <br/>
                                <span className="text-[0.7em]">Written by: {problemData.creator}</span><br/>
                                <span className="text-[0.65em] italic font-light">Created:{" "} 
                                {dayjs(problemData.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </Title>
                            <Row className="flex flex-row mt-4 mr-12 gap-2 items-center h-min
                            text-slate-500 bg-slate-100 py-1 px-3 rounded-full">
                                <span className="flex place-items-center text-[1.5em]">
                                    <Tooltip color="#0369a1" title={"Log in to vote!"}>
                                        <LikeOutlined/>
                                    </Tooltip>
                                </span>
                                <span className="flex place-items-center text-[1.25em]">
                                Vote
                                    <div className="bg-slate-200 rounded-full ml-1 p-1">
                                        <span className="px-1">
                                            {problemData.likes - problemData.dislikes}
                                        </span>
                                    </div>
                                </span>
                                <span className="flex place-items-center text-[1.5em]">
                                    <Tooltip color="#0369a1" title={"Log in to vote!"}>
                                        <DislikeOutlined/>
                                    </Tooltip>
                                </span>
                            </Row>
                        </Row>
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
                                        {problemData.options.map((item:string, key:number) => 
                                            <div key={key} className="answerbox-non-auth" 
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
                                        <span className="mt-4">You are not signed in!{" "}
                                        <Link href={`/login/${key}`} className="font-bold text-sky-600 hover:text-sky-400 transition-all duration-300">Log in{" "}</Link>
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
        }
        </>
    )
}