import { userService, problemService } from "@/services"
import { useState, useEffect } from "react"
import {Row, Col, Card, Table, Typography, Button} from "antd"
import dayjs from "dayjs"
import DeleteProblem from "@/components/modals/DeleteProblem"
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import AddProblem from "@/components/modals/AddProblem"
import useCurrentUser from "@/hooks/useCurrentUser"

const {Text, Title, Paragraph} = Typography

export default function Problems(){
    const [problemList, setProblemList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [focusProblem, setFocusProblem] = useState<any>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

    const {currentUser:currentUser} = useCurrentUser();

    const fetch = async() => {
        setLoading(true);
        try{
            const response = await (async(userlessList:Array<any>) => {
                const clone = [...userlessList]
                console.log(clone)
                for(const problem of userlessList){
                    try{
                        const userresponse = await userService.get({}, problem.user)
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
            })(await problemService.get({}))
            setProblemList([...response])
            setLoading(false)
        }
        catch(err){
            console.log(err)
            setLoading(false)
        }
    }

    useEffect(() => {fetch()}, [])

    const columns:Array<any> = [
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            sorter: true,
            align: "center",
            render: ((text:string, item:any) => {
                const formattedDate = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss');
                return <Text>{formattedDate}</Text>
            })
        },
        {
            title: "Creator",
            dataIndex: "creator",
            key: "creator",
            width: 150,
            align: "center",
            sorter:true,
            render: ((text:string, item:any) => {
                return <Text>{item.creator}</Text>
            })
        },
        {
            title: "Key",
            dataIndex: "key",
            key: "key",
            width: 150,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item.key}</Text>
            })
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            width: 100,
            sorter:true,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item.value}</Text>
            })
        },
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            width: 250,
            align: "center",
            render: ((text:string, item:any) => {
                return <Paragraph ellipsis={{ rows: 5, expandable: true }}>{item.question}</Paragraph>
            })
        },
        {
            title: "Options",
            dataIndex: "options",
            key: "options",
            width: 250,
            align: "center",
            render: ((text:string, item:any) => {
                const clone = [...item.options]
                clone[item.answer] = "**"+clone[item.answer]+"**"
                return <Text>{clone.join(', ')}</Text>
            })
        },
        {
            title: "Solution",
            dataIndex: "solution",
            key: "solution",
            width: 250,
            align: "center",
            render: ((text:string, item:any) => {
                return <Paragraph ellipsis={{ rows: 5, expandable: true }}>{item.solution}</Paragraph>
            })
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            align: "center",
            render: (text: string, item: any) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                setFocusProblem(item);
                                setDeleteModalOpen(true);
                            }}
                            type="link"
                            danger
                            className="bg-red-50 border-red-200"
                        >
                            Delete
                        </Button>
                    </div>
                );
            },
        }
    ]

    return(
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={23}>
                <Card
                title={
                    <Row className="flex flex-row justify-between">
                    <Title level={4} className="pt-4">
                        Problems
                    </Title>
                        <Row className="flex flex-row mt-4 gap-4 justify-center">
                            <Button className="bg-sky-600"
                            type="primary"
                            onClick={() => {setAddModalOpen(true)}}>
                                <Row className="flex flex-row items-center gap-1">
                                    Create <PlusOutlined/>
                                </Row>
                            </Button>
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
                        pageSize:5
                    }}
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