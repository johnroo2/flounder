import { Input, Row, Col, Form, Typography, Button, notification, Card } from "antd"
import useSignup from "@/hooks/useSignup";
import router from "next/router";
import { CloseOutlined } from "@ant-design/icons";

const {Title} = Typography

export default function Signup(){
    const [form] = Form.useForm();
    const {signup: signup} = useSignup();

    const handleSubmit = async(formvalues:any) => {
        const info = await signup(formvalues);
        if(info.pass){
            router.push('/users');
        }
        else{
            makeNotification(info?.output?.response?.data)
        }
    }

    const makeNotification = (message:any) => {
        notification.open({
            message: "Signup Failed",
            description: Array.isArray(message) && message[0] && message[0] === "This username is already in use."
            ? "This username is already in use." : "Internal server error.",
            icon:  
            <CloseOutlined
            className="text-red-500 text-[0.9em] mt-4"
            />
        })
    }

    return(
        <Row className="base-fullheight base-flexcenter">
            <Col span={24} className="flex flex-col items-center justify-center">
                <Card
                title={
                    <Title level={4} className="text-center pt-2">
                        Signup Form
                    </Title>
                }>
                    <Form 
                    layout="vertical"
                    className="w-[300px]"
                    onFinish={handleSubmit}
                    form={form}>
                        <Form.Item label="Username" name="username">
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input.Password/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full bg-sky-600">
                            Sign Up
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}