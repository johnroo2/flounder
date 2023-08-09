import {Row, Col, Modal, Typography, Button, Input, Form, Divider, Checkbox} from 'antd';
import { problemService } from '@/services';
import { useState, useEffect } from 'react';

const {Title} = Typography
const {TextArea} = Input

interface props{
    open:boolean,
    close:() => void,
    refreshData:() => any
}

export default function AddProblem({open, close, refreshData}:props){
    const [form] = Form.useForm();

    useEffect(() => {
        return(() => {
            form.resetFields();
            refreshData();
        })
    }, [form, open])

    const submit = (formvalues:any) => {
        close();
        refreshData();
    }

    return(
        <Modal
        width={1000}
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
                    <Row className="flex flex-row justify-between">
                        <Col className="w-[48%]">
                            <Form.Item label="Question" name="question" 
                                rules={[
                                    {
                                        required:true,
                                        message:"Please fill out this field."
                                    }
                                ]}>
                                    <TextArea maxLength={10000} autoSize showCount/>
                            </Form.Item>
                        </Col>
                        <Col className="w-[48%]">
                            <Form.Item label="Solution" name="solution">
                                <TextArea maxLength={10000} autoSize showCount/>
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