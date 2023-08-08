//import { problemService } from "@/services"
import { useState, useEffect } from "react"
import {Row, Col, Card, Table, Typography, Button} from "antd"
import dayjs from "dayjs"

const {Text, Title} = Typography

export default function Problems(){
    const [problemList, setProblemList] = useState<any>([]);

    // const fetch = async() => {
    //     try{
    //         const response = await problemService.get();
    //         console.log(response);
    //         setProblemList(response);
    //     }
    //     catch(err){
    //         console.log(err)
    //     }
    // }

    // useEffect(() => {fetch()}, [])

    const columns:Array<any> = [
    ]

    return(
        <Row className="base-fullheight base-flexhorizontal pt-4">
            <Col span={20}>
                <Card
                title={
                    <Title level={4} className="pt-4">
                        Problems
                    </Title>
                }>
                    <Table
                    size="small"
                    pagination={{
                        pageSize:5
                    }}
                    columns={columns}
                    dataSource={problemList}>

                    </Table>
                </Card>
            </Col>
        </Row>
    )
}