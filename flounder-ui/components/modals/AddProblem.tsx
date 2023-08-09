import {Row, Col, Modal, Typography, Button, Input, Form, Divider, Tooltip, InputNumber, Image, notification} from 'antd';
import { problemService } from '@/services';
import { useState, useEffect } from 'react';
import { CheckOutlined, CloseOutlined, InfoCircleTwoTone, UploadOutlined } from '@ant-design/icons';
import FullUpload from '../misc/FullUpload';
import { RcFile } from 'antd/es/upload';

const {Title} = Typography
const {TextArea} = Input

interface props{
    open:boolean,
    close:() => void,
    refreshData:() => any,
    currentUser: any,
}

export default function AddProblem({open, close, refreshData, currentUser}:props){
    const [form] = Form.useForm();
    const [image, setImage] = useState<any>(null);
    const [imageData, setImageData] = useState<FormData | null>(null);

    useEffect(() => {
        return(() => {
            setImage(null)
            setImageData(null)
            form.resetFields();
            refreshData();
        })
    }, [form, open])

    const handleImage = (formData:FormData) => {
        setImageData(formData);
        ((image:File) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result as string;
                setImage(imageDataUrl);
            reader.readAsDataURL(image);
        }})(formData.get('image') as File)
    }

    const submit = async(formvalues:any) => {
        try{
            const options:Array<string> = formvalues.options.split('/')
            const id = currentUser?.id

            if(options.length <= formvalues.answer){
                notification.open({
                    message: "Error",
                    description: `Answer index of bounds. Value provided: ${formvalues.answer}, 
                    index limit: ${options.length-1}`,
                    icon:<CloseOutlined style={{color: '#ff0303',}}/>
                })
                return;
            }

            const payload = {...formvalues, options:options, user:id}
            const response = await problemService.post(payload)

            if(response){
                if(imageData){
                    await problemService.putImage(imageData, response.id)
                }
                makeNotification('success')
            }
        }
        catch(err){
            console.log(err)
            makeNotification('error')
        }
        finally{
            close();
            refreshData();
        }
    }

    const makeNotification = (message: any) => {
        notification.open({
          message: message === 'success' ? "Success" : "Error",
            description:
              message === 'success'
                ? "Problem created successfully."
                : "Internal server error.",
            icon:
                message === 'success' ? 
                (<CheckOutlined style={{color: '#02f760',}}/>) 
                : (<CloseOutlined style={{color: '#ff0303',}}/>),
        });
    }

    return(
        <Modal
        width={900}
        open={open}
        onCancel={close}
        footer={false}
        centered
        title={
            <Title level={4} className="mt-4">
                Create Problem
            </Title>
        }>
            <Col span={24}>
                <Form onFinish={submit} form={form} layout="vertical">
                    <Row gutter={[16,8]}>
                        <Col span={12}>
                            <Form.Item label="Question" name="question" 
                                rules={[
                                    {
                                        required:true,
                                        message:"Please fill out this field."
                                    }
                                ]}>
                                    <TextArea maxLength={2500} autoSize showCount/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Solution" name="solution">
                                <TextArea maxLength={2500} autoSize showCount/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                label={
                                <Tooltip 
                                title={`Include up to 6 options seperated by \"/\"`} 
                                placement="top">
                                    <Row className="flex flex-row gap-2 items-center">
                                        <Typography.Text>
                                            Options
                                        </Typography.Text>
                                        <InfoCircleTwoTone className="text-[1.1em]"/>
                                    </Row>
                                </Tooltip>} 
                                name="options" 
                                rules={[
                                    {
                                        required:true,
                                        message:"Please fill out this field."
                                    }
                                ]}>
                                    <TextArea maxLength={3006} autoSize/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item 
                                label={
                                <Tooltip 
                                title={`Select an index from 0-5 inclusive`} 
                                placement="top">
                                    <Row className="flex flex-row gap-2 items-center">
                                        <Typography.Text>
                                            Answer
                                        </Typography.Text>
                                        <InfoCircleTwoTone className="text-[1.1em]"/>
                                    </Row>
                                </Tooltip>} 
                                name="answer" 
                                rules={[
                                    {
                                        required:true,
                                        message:"Please fill out this field."
                                    }
                                ]}>
                                    <InputNumber min={0} max={5}
                                    className="w-full"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Value" name="value" 
                            rules={[
                                {
                                    required:true,
                                    message:"Please fill out this field."
                                }
                            ]}>
                                <InputNumber min={1} max={30}
                                    className="w-full"/>
                            </Form.Item>
                        </Col>
                        <Col span={12} className="flex flex-row gap-8 items-center">
                            <Form.Item
                            label={
                                <Tooltip 
                                title={`Supported image types: ".png, .jpg, .jpeg, .gif", Max Upload is 5MB.`} 
                                placement="top">
                                    <Row className="flex flex-row gap-2 items-center">
                                        <Typography.Text>
                                            Image
                                        </Typography.Text>
                                        <InfoCircleTwoTone className="text-[1.1em]"/>
                                    </Row>
                                </Tooltip>} 
                                >
                                    <FullUpload
                                    render={
                                        <div className="flex flex-col gap-2 items-center 
                                        justify-center p-10
                                        rounded-md border-dotted border-2 border-black">
                                            <UploadOutlined className="text-[1.5em]"/>
                                            <span className="text-[0.9em] text-center">Upload Image</span>
                                        </div>
                                    }
                                    onSubmit={(formData) => {
                                        handleImage(formData)
                                    }}
                                    />
                            </Form.Item>
                            {image && <Image
                            className="max-h-[8rem]"
                            src={image}/>}
                        </Col>
                        <Col span={12}>
                            <Form.Item label="User Info" name="user">
                                <Input disabled defaultValue={`${currentUser?.id}: ${currentUser?.username}`}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider/>
                    <Row className="flex flex-row gap-2 justify-end">
                        <Button
                        type="primary"
                        danger
                        onClick={close}>
                            Cancel
                        </Button>
                        <Button
                        type="primary"
                        className="bg-sky-700"
                        htmlType="submit">
                            Finish
                        </Button>
                    </Row>
                </Form>
            </Col>
        </Modal>
    )
}