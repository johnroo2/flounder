import { Input, Row, Col, Form, Typography, Button, notification, Card } from "antd"
import { useLogin } from "@/hooks/useLogin";
import {useRouter} from "next/router";
import { CloseOutlined } from "@ant-design/icons"
import Link from "next/link";

const {Title} = Typography;

export default function Login(){
    const router = useRouter();
    const [form] = Form.useForm();
    const {login:login} = useLogin();

    const handleSubmit = async(formvalues:any) => {
        const info = await login(formvalues.username, formvalues.password)
        if(info.pass){
            router.push(info.output?.username ? `/profile/${info.output.username}` : "/");
        }
        else{
            makeNotification(info?.output?.response?.data)
        }
    }

    const makeNotification = (message:any) => {
        notification.open({
            message: "Login Failed",
            description: message === "Credentials" ? "Incorrect username or password." : "Internal server error.",
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
                        Login Form
                    </Title>
                }>
                    <Form 
                    layout="vertical"
                    className="w-[300px]"
                    onFinish={handleSubmit}
                    form={form}>
                        <Form.Item label="Username" name="username" 
                        validateTrigger="onBlur"
                        rules={[
                            {
                                required:true,
                                message:"Please fill out this field."
                            },
                            // { validator: (rule:any, value:any) => {
                            // const pattern = /^[^/]*$/;
                            // if(value && !pattern.test(value)){
                            //     alert('Character "/" is not allowed! (this is temporary)')
                            //     Promise.reject();
                            // }
                            // else{
                                
                            //     Promise.resolve();
                            // }
                    
                            // }}
                        ]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Password" name="password"
                        rules={[
                            {
                                required:true,
                                message:"Please fill out this field."
                            }
                        ]}>
                            <Input.Password/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full bg-sky-600">
                            Login
                        </Button>
                        <p className="mt-4">
                            Don't have an account? Sign up <Link className="text-sky-600" href={"/signup"}>here</Link>!
                        </p>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}