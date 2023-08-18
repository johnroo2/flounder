import { userService } from "@/services"
import { useState, useEffect } from "react"
import {Row, Col, Card, Table, Typography, Button, Select, Input, Tooltip} from "antd"
import { ReloadOutlined } from "@ant-design/icons"
import Link from "next/link"

const {Text, Title} = Typography
const {Search} = Input

export default function Users(){
    const [userList, setUserList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetch = async(params?:any) => {
        setLoading(true)
        try{
            const response = await userService.get(params)
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
            setLoading(true)
            await fetch(params)
        }
    }

    const columns:Array<any> = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
            width: 100,
            render: ((text:string, item:any) => {
                return (
                <Text className="flex flex-row gap-2">
                    <Link
                    href={`/profile/${item.username}`}>
                        <Text
                        className="text-sky-600 hover:text-sky-400 transition-all duration-300">
                            {item.username}
                        </Text>
                    </Link>
                    <Tooltip
                    color="#0369a1" 
                    placement="top"
                    title="Admin">
                        {item.isAdmin ? " 😎": ""}
                    </Tooltip>
                    <Tooltip
                    color="#0369a1" 
                    placement="top"
                    title="Moderator">
                        {item.isMod ? " 🛡️" : ""}
                    </Tooltip>
                </Text>
            )})
        },
        {
            title: "Points",
            dataIndex: "points",
            key: "points",
            width: 100,
            defaultSortOrder: "descend",
            render: ((text:string, item:any) => {
                return <Text>{item?.points}</Text>
            })
        }
    ]

    return(
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={16}>
                <Card
                title={
                    <Row className="flex flex-row justify-between items-center">
                        <Title level={4} className="pt-4">
                            Users
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
                    dataSource={userList}>

                    </Table>
                </Card>
            </Col>
        </Row>
    )
}