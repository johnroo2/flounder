import {Row, Col, Modal, Divider, Button, Typography, notification} from 'antd'
import { userService } from '@/services';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLogout from '@/hooks/useLogout';

const {Text, Title} = Typography

interface props{
    open: boolean;
    close: () => void;
    details: any;
    refreshData: () => any;
}

export default function DeleteUser({open, close, details, refreshData}:props){
    const {currentUser:currentUser} = useCurrentUser();
    const {forcelogout: forcelogout} = useLogout();

    const submit = async() => {
        try{
            await userService.delete(details.id);
            makeNotification('success')
            if(details?.username === currentUser?.username){
                forcelogout();
            }
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
                ? "User deleted successfully."
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
                Delete User
            </Title>
        }>
            <Row>
                <Text>
                    Are you sure you want to delete this user?
                    {details?.username === currentUser?.username && " (Warning: this will sign you out!)"}
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