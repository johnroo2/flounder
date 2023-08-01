import useCurrentUser from "@/hooks/useCurrentUser";
import {Col, Row, Card, Typography, Input} from "antd"

const {Title} = Typography

export default function Profile(){
    const {currentUser:currentUser} = useCurrentUser();

    return(
        <>
            {currentUser ? 
            <Row className="base-fullheight base-flexcenter">
                <Col span={24} className="flex items-center justify-center">
                    <Card
                    title={
                        <Title level={4} className="text-center pt-2">
                            Profile
                        </Title>
                    }>

                    </Card>
                </Col>
            </Row>
            :
            <></>}
        </>
    )
}