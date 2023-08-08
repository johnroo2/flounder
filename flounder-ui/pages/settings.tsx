import {Card, Row, Col, Typography, Button} from 'antd'
import Link from 'next/link'

const {Title, Text} = Typography

export default function Settings(){
    return(
        <Row className="base-fullheight base-flexcenter">
            <Col>
                <Card
                title={
                    <Title level={4} className="mt-4 text-center">
                        Settings ⚙️
                    </Title>
                }>
                    <Col span={24} className="flex flex-col gap-4">
                        <Text>
                            This page is for admin use only!
                        </Text>
                        <Link href="/settings/users">
                            <Button
                            type="primary"
                            className="w-full bg-sky-600 text-center"
                            >
                                Users
                            </Button>
                        </Link>
                        <Link href="/settings/problems">
                            <Button
                            type="primary"
                            className="w-full bg-sky-600 text-center">
                                Problems 
                            </Button>
                        </Link>
                    </Col>
                    
                </Card>
            </Col>
        </Row>
    )
}