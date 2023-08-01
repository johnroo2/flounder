import {Modal, Divider, Row, Button, Typography} from "antd";
import router from "next/router"

const {Title, Text} = Typography

export default function Logout(){
    return(
        <Modal
        open={true}
        closable={false}
        footer={false}
        width={600}
        title={
            <Title level={4} className="mt-4">
                Logged Out
            </Title>
        }>
            <Row>
                <Text>
                    You have signed out. 
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