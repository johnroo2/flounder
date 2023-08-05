import {Modal, Divider, Row, Button, Typography} from "antd";
import router from "next/router"

const {Title, Text} = Typography

export default function SessionEnd(){
    return(
        <Modal
        open={true}
        closable={false}
        footer={false}
        width={600}
        title={
            <Title level={4} className="mt-4">
                Session Expired
            </Title>
        }>
            <Row>
                <Text>
                    Your session has expired. Please log in again.
                </Text>
            </Row>
            <Divider/>
            <Row className="flex flex-row gap-2 justify-end">
                <Button
                type="primary"
                className="bg-sky-700"
                onClick={() => {router.push('/')}}>
                    Home
                </Button>
                <Button
                type="primary"
                className="bg-sky-700"
                onClick={() => {router.push('/login')}}>
                    Sign In
                </Button>
            </Row>
        </Modal>
    )
}