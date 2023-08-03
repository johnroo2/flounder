import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {Row, Col, Modal, Divider, Button, Typography, notification, Input, Form} from 'antd'
import {useEffect} from 'react';

const {Title} = Typography
const {TextArea}  = Input

interface props{
    open:boolean;
    details: any;
    close: () => void;
    refreshData: () => void;
    put: (username:string, params:any) => any;
}

export default function EditProfile({open, details, close, refreshData, put}:props){
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldValue("about", details?.about)
    }, [open, form, details])

    const submit = async(formvalues:any) => {
        try{
            const response = await put(details.username, {...formvalues});
            if(response.pass){
                makeNotification('success')
            }
            else{
                makeNotification('error');
            }
        }
        catch(err){
            console.log(err);
            makeNotification('error');
        }
        finally{
            close();
            form.resetFields();
            refreshData();
        }
    }

    const makeNotification = (message: any) => {
        notification.open({
          message: message === 'success' ? "Success" : "Error",
            description:
              message === 'success'
                ? "Profile modified successfully."
                : "Internal server error.",
            icon:
                message === 'success' ? 
                (<CheckOutlined style={{color: '#02f760',}}/>) 
                : (<CloseOutlined style={{color: '#ff0303',}}/>),
        });
    }

    return (
    <Modal
        width={800}
        open={open}
        onCancel={close}
        footer={false}
        centered
        title={
            <Title level={4} className="mt-4">
                Edit Profile
            </Title>
        }>
            <Form onFinish={submit} layout="vertical" form={form}>
                <Form.Item label="About" name="about">
                    <TextArea maxLength={1000} autoSize/>
                </Form.Item>
                <Divider/>
                <Row className="flex flex-row gap-2 justify-end">
                    <Button
                    type="primary"
                    danger
                    onClick={() => {close(); form.resetFields();}}>
                        Cancel
                    </Button>
                    <Button
                    type="primary"
                    className="bg-sky-700"
                    htmlType="submit">
                        Submit
                    </Button>
                </Row>
            </Form>
        </Modal>
    )
}