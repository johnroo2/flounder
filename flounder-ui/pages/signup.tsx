import { Input, Row, Col, Form, Typography, Button, notification, Card } from "antd"
import { useSignup } from "@/hooks/useSignup";
import {useRouter} from "next/router";
import { CloseOutlined } from "@ant-design/icons";

const {Title} = Typography

export default function Signup(){
    const router = useRouter();
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
                    <Title level={4} className="text-center pt-4">
                        Signup Form
                    </Title>
                }>
                    <Form 
                    layout="vertical"
                    className="w-[400px]"
                    onFinish={handleSubmit}
                    form={form}>
                        <Row className="flex flex-row justify-between">
                            <Col span={11}>
                                <Form.Item label="First Name" name="firstname"
                                rules={[
                                    {
                                        required:true,
                                        message:"Please fill out this field."
                                    }
                                ]}>
                                    <Input maxLength={20}/>
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item label="Last Name" name="lastname"
                                rules={[
                                    {
                                        required:true,
                                        message:"Please fill out this field."
                                    }
                                ]}>
                                    <Input maxLength={20}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="Email" name="email"
                        rules={[
                            {
                                required:true,
                                type:"email",
                                message:"Please enter a valid email."
                            }
                        ]}>
                            <Input required/>
                        </Form.Item>
                        <Form.Item label="Username" name="username"
                        rules={[
                            {
                                required:true,
                                message:"Please fill out this field."
                            }
                        ]}>
                            <Input maxLength={20}/>
                        </Form.Item>
                        <Form.Item label="Password (min length 6)" name="password"
                        rules={[
                            {
                                required:true,
                                message:"Please fill out this field."
                            }
                        ]}>
                            <Input.Password maxLength={20} minLength={6}/>
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