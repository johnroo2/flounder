import {Row, Col, Modal, Divider, Button, Typography, notification} from 'antd'
import { problemService } from '@/services';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const {Text, Title} = Typography

interface props{
    open: boolean;
    close: () => void;
    details: any;
    refreshData: () => any;
}

export default function DeleteProblem({open, close, details, refreshData}:props){

    const submit = async() => {
        try{
            await problemService.delete(details.id);
            makeNotification('success')
        }
        catch(err){
            console.log(err);
            makeNotification('error');
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
                ? "Problem deleted successfully."
                : "Internal server error.",
            icon:
                message === 'success' ? 
                (<CheckOutlined style={{color: '#02f760',}}/>) 
                : (<CloseOutlined style={{color: '#ff0303',}}/>),
        });
    }

    return (
        <Modal
        width={600}
        open={open}
        onCancel={close}
        footer={false}
        centered
        title={
            <Title level={4} className="mt-4">
                Delete Problem
            </Title>
        }>
            <Row>
                <Text>
                    Are you sure you want to delete this problem?
                </Text>
            </Row>
            <Divider/>
            <Row className="flex flex-row gap-2 justify-end">
                <Button
                type="primary"
                className="bg-sky-700"
                onClick={close}>
                    Cancel
                </Button>
                <Button
                type="primary"
                danger
                onClick={submit}>
                    Delete
                </Button>
            </Row>
        </Modal>
    )
}