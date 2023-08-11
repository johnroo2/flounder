import { Button, Row, Col, Typography, Card, List, Segmented, Select } from 'antd';
import useCurrentUser from '@/hooks/useCurrentUser';
import Link from 'next/link';
import PointsChart from '@/components/chart/PointsChart';
import { useState } from 'react';
import type { Mode } from '@/types/Mode';
import { modeOptions } from '@/types/Mode';

const { Title } = Typography;

export default function Index() {
  const { currentUser: currentUser } = useCurrentUser();
  const [points, setPoints] = useState<number> (-1)
  const [mode, setMode] = useState<Mode>("Last 28 Days")

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
                <Col span={10} offset={1} className="flex flex-col gap-4 w-full">
                  <Row className="flex flex-row gap-10 items-center justify-between">
                    <Title level={4}>
                      Your Points <br/>
                      <span className="text-[0.7em]">
                        {points >= 0 ? `Total Points: ${points}` : "Fetching Points..."}
                      </span>
                    </Title>
                    <Select
                    value={mode}
                    className="min-w-[12em]"
                    onSelect={(value:Mode) => {setMode(value)}}
                    onClear={() => {setMode("Last 28 Days")}}>
                      {modeOptions.map((item:string, key:number)=>
                      <Select.Option value={item} key={key}>
                        {item}
                      </Select.Option>)}
                    </Select>
                  </Row>
                  <PointsChart userData={currentUser} setPoints={setPoints} mode={mode}/>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}