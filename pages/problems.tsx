import { userService, problemService } from "@/services"
import { useState, useEffect } from "react"
import {Row, Col, Card, Table, Typography, Button, Input, Select} from "antd"
import DeleteProblem from "@/components/modals/DeleteProblem"
import { CheckCircleTwoTone, CloseCircleTwoTone, DislikeFilled, LikeFilled, MinusCircleTwoTone, ReloadOutlined } from "@ant-design/icons"
import AddProblem from "@/components/modals/AddProblem"
import useCurrentUser from "@/hooks/useCurrentUser"
import Link from "next/link"
import React from "react"

const {Text, Title} = Typography
const {Search} = Input

export default function Problems(){
    const [problemList, setProblemList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [focusProblem, setFocusProblem] = useState<any>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [searchLabel, setSearchLabel] = useState<string>()
    const [searchParam, setsearchParam] = useState<string>()
    
    const {currentUser:currentUser} = useCurrentUser();

    const searchQueries:{label:string, queryparam:string}[] = [
        {
            label:"Creator",
            queryparam:"creator"
        },
        {
            label:"Point Value",
            queryparam:"value"
        }
    ]

    const fetch = async(params?:any) => {
        setLoading(true);
        try{
            const response = await (async(userlessList:Array<any>) => {
                const clone = [...userlessList]
                const memo = new Map()
                for(const problem of userlessList){
                    try{
                        let userresponse:any;
                        if(memo.has(problem.user)){
                            userresponse = memo.get(problem.user)
                        }
                        else{
                            userresponse = await userService.get({}, problem.user)
                            if(userresponse){
                                memo.set(problem.user, {...userresponse})
                            }
                        }
                        clone.forEach((item:any) => {
                            if(item.user === problem.user && userresponse){
                                item.creator = userresponse?.username;
                            }
                        })
                    }
                    catch(err){
                        console.log(err)
                        continue;
                    }
                }
                return clone;
            })(await problemService.get(params))
            setProblemList([...response])
            setLoading(false)
        }
        catch(err){
            console.log(err)
            setLoading(false)
        }
    }

    const handlePaginationChange = async(
        pagination:any,
        filters:any,
        sorter:any,
        extra:any
    ) => {
        const {action} = extra;

        if (action === 'sort') {
            const params = {
                sortBy: sorter.columnKey ? sorter.columnKey : 'id',
                sortDirection: sorter.order === 'ascend' ? 'asc' : 'desc',
            };
            setLoading(true);
            await fetch(params)
        }
    }

    useEffect(() => {fetch()}, [])

    const columns:Array<any> = [
        {
            title: "Creator",
            dataIndex: "creator",
            key: "creator",
            width: 100,
            render: ((text:string, item:any) => {
                return(
                    <Link
                    href={`/profile/${item.creator}`}>
                        <Text
                        className="text-sky-600 hover:text-sky-400 transition-all duration-300">
                            {item.creator}
                        </Text>
                    </Link>
            )})
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 200,
            render: ((text:string, item:any) => {
                let solveState = "none";
                if(currentUser){
                    if(item.solvers.includes(currentUser.id)){
                        solveState = "correct";
                    }
                    else if(item.attempts.includes(currentUser.id)){
                        solveState = "incorrect";
                    }
                    else{
                        solveState = "neutral"
                    }
                }
                const renders:{[key:string]:JSX.Element} = {
                    "incorrect":<CloseCircleTwoTone twoToneColor="#ef4444"/>,
                    "neutral":<MinusCircleTwoTone twoToneColor="#f59e0b"/>,
                    "correct":<CheckCircleTwoTone twoToneColor="#22c55e"/>
                }
                return(
                    <Row className="flex flex-row gap-2 items-center">
                        {currentUser && renders[solveState]}
                        <Link href={`/problems/${item.key}`}>
                            <Text className="text-sky-600 hover:text-sky-400 transition-all duration-300">
                                {item.title}
                            </Text>
                        </Link>
                    </Row>
            )})
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            width: 100,
            render: ((text:string, item:any) => {
                return <Text>{item.value}</Text>
            })
        },
        {
            title: "Votes",
            dataIndex: "votes",
            key: "votes",
            width: 150,
            render: ((text:string, item:any) => {
                const percent_length = (item.likes + item.dislikes > 0) ? (100 * item.likes)/(item.likes+item.dislikes) : 0 
                return (
                    <Row className="flex flex-row items-center justify-center gap-2">
                        <DislikeFilled className={`pl-[10%]`}/>
                        <Text>
                            {item.dislikes}
                        </Text>
                        <div className="rounded-full grow h-1 bg-gray-300">
                            <div className={percent_length == 0 ? 
                            '`rounded-l-full h-1 w-full bg-gray-300`':
                            `rounded-l-full h-1 w-[${percent_length}%] bg-sky-300`}/>
                        </div>
                        <Text>
                            {item.likes}
                        </Text>
                        <LikeFilled className="pr-[10%]"/>
                    </Row>
                )
            })
        },
    ]

    return(
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={16}>
                <Card
                title={
                    <Row className="flex flex-row justify-between">
                    <Title level={4} className="pt-4">
                        Problems
                    </Title>
                        <Row className="flex flex-row mt-4 gap-4 justify-center items-center">
                            <Button className="rounded-full"
                            type="primary"
                            ghost
                            onClick={() => {fetch()}}>
                                <ReloadOutlined/>
                            </Button>
                        </Row>
                    </Row>
                }>
                    <Table
                    size="small"
                    pagination={{
                        pageSize:10
                    }}
                    onChange={handlePaginationChange}
                    loading={loading}
                    columns={columns}
                    dataSource={problemList}>

                    </Table>
                </Card>
            </Col>
            <DeleteProblem
            details={focusProblem}
            open={deleteModalOpen}
            close={() => {setDeleteModalOpen(false)}}
            refreshData={fetch}/>
            <AddProblem
            open={addModalOpen}
            close={() => {setAddModalOpen(false)}}
            refreshData={fetch}
            currentUser={currentUser}/>
        </Row>
    )
}