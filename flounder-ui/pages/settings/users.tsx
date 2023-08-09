import { userService, pointService } from "@/services"
import { useState, useEffect } from "react"
import {Row, Col, Card, Table, Typography, Button} from "antd"
import dayjs from "dayjs"
import DeleteUser from "@/components/modals/DeleteUser"
import { ReloadOutlined } from "@ant-design/icons"

const {Text, Title} = Typography

export default function Users(){
    const [userList, setUserList] = useState<any>([]);
    const [focusUser, setFocusUser] = useState<any>({});
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const fetch = async() => {
        setLoading(true)
        try{
            const response = await (async(pointlessList:Array<any>) => {
                const clone = [...pointlessList]
                for(const user of pointlessList){
                    try{
                        const pointresponse = await pointService.get(user.username)
                        clone.forEach((item:any) => {
                            if(item.username === user.username && pointresponse){
                                item.points =  pointresponse?.points;
                            }
                        })
                    }
                    catch(err){
                        console.log(err)
                        continue;
                    }
                }
                return clone;
            })(await userService.get({}))
            setUserList([...response])
            setLoading(false)
        }
        catch(err){
            console.log(err)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetch();
    }, [])

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
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            sorter: true,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item.firstname}{" "}{item.lastname}</Text>
            })
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            width: 150,
            sorter: true,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item.username}</Text>
            })
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 200,
            sorter: true,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item.email}</Text>
            })
        },
        {
            title: "Points",
            dataIndex: "points",
            key: "points",
            width: 100,
            sorter: true,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item?.points}</Text>
            })
        },
        {
            title: "Role: Mod",
            key: "isMod",
            dataIndex: "isMod",
            width: 75,
            sorter:true,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item.isMod ? "Y" : "N"}</Text>
            })
        },
        {
            title: "Role: Admin",
            key: "isAdmin",
            dataIndex: "isAdmin",
            sorter:true,
            width: 75,
            align: "center",
            render: ((text:string, item:any) => {
                return <Text>{item.isAdmin ? "Y" : "N"}</Text>
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
                                setFocusUser(item);
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
            <Col span={20}>
                <Card
                title={
                    <Row className="flex flex-row justify-between">
                        <Title level={4} className="pt-4">
                            Users
                        </Title>
                        <Button className="rounded-full"
                            type="primary"
                            ghost
                            onClick={() => {fetch()}}>
                            <ReloadOutlined/>
                        </Button>
                    </Row>
                }>
                    <Table
                    size="small"
                    pagination={{
                        pageSize:5
                    }}
                    loading={loading}
                    columns={columns}
                    dataSource={userList}>

                    </Table>
                </Card>
            </Col>
            <DeleteUser
            details={focusUser}
            open={deleteModalOpen}
            close={() => {setDeleteModalOpen(false)}}
            refreshData={fetch}/>
        </Row>
    )
}