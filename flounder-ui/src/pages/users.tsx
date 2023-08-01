import { userService } from "@/services"
import { useState, useEffect } from "react"
import {Row, Col, Typography} from "antd"

const {Title} = Typography

export default function Users(){
    const [userList, setUserList] = useState<any>([]);

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

    return(
        <Row className="base-fullheight base-flexcenter">
            <Col className="flex flex-col items-center justify-center gap-4">
                <Title level={3}>List of Users</Title>
                {userList.map((user:any, key:any) => {
                return (
                    <Row className="bg-sky-200 text-black p-2 text-lg w-[400px] rounded-md">
                        username: {user.username} <br/>
                        roles: {user.roles} <br/>
                        points: {user.points} <br/>
                        joined: {new Date(user.createdAt).toLocaleString('en-US')}
                    </Row>
                )})}
            </Col>
        </Row>
    )
}