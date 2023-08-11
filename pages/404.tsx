import {Row, Col, Button, Typography, Card, Empty} from 'antd'
import { GetStaticProps } from 'next'
import router from 'next/router'

const {Title} = Typography

export default function NotFoundPage(){
    return(
        <Row className="base-fullheight base-flexcenter">
          <Col span={16} className="flex items-center justify-center">
            <Card
              title={
                <Title level={3} className="text-center pt-4">
                    404 Not Found
                </Title>
              }
            >
                <Empty description={
                    <Row className="flex flex-col gap-4 items-center">
                        <span>Sorry, the page you were looking for cannot be found.</span>
                        <Row className="flex flex-row gap-4">
                            <Button
                            type="primary"
                            className="bg-sky-600"
                            onClick={() => {
                                router.push('/')
                            }}>
                                Home
                            </Button>
                            <Button
                            type="primary"
                            className="bg-sky-700"
                            onClick={() => {
                                router.back()
                            }}>
                                Return
                            </Button>
                        </Row>
                    </Row>
                }/>
            </Card>
          </Col>
        </Row>
    )
}