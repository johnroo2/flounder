import { Button, Row, Col, Typography, Card } from 'antd'

const {Title} = Typography

export default function Index() {
  return (
    <Row className="base-fullheight base-flexcenter">
      <Col span={24} className="flex items-center justify-center">
        <Card
        title={
            <Title level={4} className="text-center pt-4">
                Flounder 🐟
            </Title>
        }>
          <Col className="flex flex-col gap-4">
            <Button
            type="primary"
            className="bg-sky-600 hover:bg-sky-400 min-w-[200px]"
            href="/login"
            >
              Login
            </Button>
            <Button
            type="primary"
            className="bg-sky-600 hover:bg-sky-400 min-w-[200px]"
            href="/signup"
            >
              Sign Up
            </Button>
          </Col>
        </Card>
      </Col>
    </Row>    
  )
}