import {Modal, Divider, Row, Button, Typography} from "antd";
import { useRouter } from "next/router"

const {Title, Text} = Typography

export default function NoPermission(){
    return(
        <Modal
        open={true}
        closable={false}
        footer={false}
        width={600}
        title={
            <Title level={4} className="mt-4">
                Access Denied
            </Title>
        }>
            <Row>
                <Text>
                    You do not have permission to view this page.
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
            </Row>
        </Modal>
    )
}