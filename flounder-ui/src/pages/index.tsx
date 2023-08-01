import useCurrentUser from '@/hooks/useCurrentUser';
import useLogout from '@/hooks/useLogout';
import { Button, Row, Col, Typography, Card } from 'antd'

const {Title} = Typography

export default function Index() {
  const {currentUser:currentUser} = useCurrentUser();
  const {logout:logout} = useLogout();

  const getText = () => {
    console.log(currentUser)
    return "(" + (currentUser ?
      `Hello, ${currentUser.username}`:
      "You are not signed in!") + ")"
  }

  return (
    <Row className="base-fullheight base-flexcenter">
      <Col span={24} className="flex items-center justify-center">
        <Card
        title={
            <Title level={4} className="text-center pt-2">
                Flounder 🐟
            </Title>
        }>
          <Col className="flex flex-col gap-4">
            <Button
            type="primary"
            className="bg-sky-600 hover:bg-sky-400 min-w-[200px]"
            href="/login"
            >
              Login
            </Button>
            <Button
            type="primary"
            className="bg-sky-600 hover:bg-sky-400 min-w-[200px]"
            href="/signup"
            >
              Sign Up
            </Button>
            <span className="text-md text-center">
              {getText()}
            </span>
            {currentUser && <Button
            type="primary"
            className="bg-sky-600 hover:bg-sky-400 min-w-[200px]"
            onClick={logout}
            >
              Logout
            </Button>}
          </Col>
        </Card>
      </Col>
    </Row>    
  )
}