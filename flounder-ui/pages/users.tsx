import { userService } from "@/services"
import { useState, useEffect } from "react"
import {Row, Col, Card, Table, Typography, Button} from "antd"
import dayjs from "dayjs"
import { CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons"
import DeleteUser from "@/components/modals/DeleteUser"

const {Text, Title} = Typography

export default function Users(){
    const [userList, setUserList] = useState<any>([]);
    const [focusUser, setFocusUser] = useState<any>({});
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    const fetch = async() => {
        try{
            const response = await userService.get();
            console.log(response);
            setUserList(response);
        }
        catch(err){
            console.log(err)
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
                const formattedDate = dayjs(item.createdAt).format('YYYY-MM-DD');
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
                return <Text>{item.points}</Text>
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
        <Row className="base-fullheight base-flexhorizontal pt-10">
            <Col span={20}>
                <Card
                title={
                    <Title level={4} className="pt-4">
                        Users
                    </Title>
                }>
                    <Table
                    pagination={{
                        pageSize:5
                    }}
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