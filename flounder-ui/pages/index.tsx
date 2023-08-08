import { Button, Row, Col, Typography, Card, List, Segmented } from 'antd';
import useCurrentUser from '@/hooks/useCurrentUser';
import Link from 'next/link';
import PointsChart from '@/components/chart/PointsChart';

const { Title } = Typography;

export default function Index() {
  const { currentUser: currentUser } = useCurrentUser();

  return (
    <>
      {!currentUser ? (
        <Row className="base-fullheight base-flexcenter">
          <Col span={24} className="flex items-center justify-center">
            <Card
              title={
                <Title level={4} className="text-center pt-4">
                  Flounder 🐟
                </Title>
              }
            >
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
              </Col>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="base-fullheight base-flexhorizontal pt-4">
          <Col span={20}>
            <Card
              className="h-[calc(100vh_-_64px_-_2rem)] overflow-y-scroll"
              title={
                <Row>
                  <Title level={3} className="pt-4">
                    Dashboard ⚓ <br />
                    <span className="text-[0.75em]">Hello, {currentUser.username}!</span>
                    
                  </Title>
                </Row>
              }
            >
              <Row>
                <Col span={10} className="flex flex-col gap-4">
                  <Title level={4}>New Problems</Title>
                  <List
                  dataSource={[
                  {label: "Hot Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Trending Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Spicy Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Interesting Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Hard Problem", href:"https://artofproblemsolving.com/"},
                  ]}
                  renderItem={(item:any, key:number) => 
                  <List.Item key={key}>
                    <Link href={item.href}>
                    • {item.label}
                    </Link>
                  </List.Item>}>           
                  </List>   

                  <Title level={4} className="mt-4">Recent Solves</Title>
                  <List
                  dataSource={[
                  {label: "Easy Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Trivial Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Mild Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Basic Problem", href:"https://artofproblemsolving.com/"},
                  {label: "Not-even-a Problem", href:"https://artofproblemsolving.com/"},
                  ]}
                  renderItem={(item:any, key:number) => 
                  <List.Item key={key}>
                    <Link href={item.href}>
                    • {item.label}
                    </Link>
                  </List.Item>}>           
                  </List>                 
                </Col>
                <Col span={10} offset={1} className="flex flex-col gap-4">
                  <Row className="flex flex-row gap-10 items-center justify-between">
                    <Title level={4}>
                      Your Points
                    </Title>
                  </Row>
                  <PointsChart currentUser={currentUser}/>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
