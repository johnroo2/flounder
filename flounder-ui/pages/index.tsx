import { Button, Row, Col, Typography, Card, List, Segmented } from 'antd';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Chart, ChartItem, registerables } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLogout } from '@/hooks/useLogout';

Chart.register(...registerables)

const { Title } = Typography;

export default function Index() {
  const { currentUser: currentUser } = useCurrentUser();
  const { logout: logout} = useLogout();
  const [chartStack, setChartStack] = useState<string>("Total");
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const data = (chartStack === "Total") ? 
    [
      { month: "Feb", count: 4 },
      { month: "Mar", count: 5 },
      { month: "Apr", count: 20 },
      { month: "May", count: 27 },
      { month: "Jun", count: 33 },
      { month: "Jul", count: 43 },
      { month: "Aug", count: 45 },
    ]
    : 
    [
      { month: "Feb", count: 4 },
      { month: "Mar", count: 1 },
      { month: "Apr", count: 15 },
      { month: "May", count: 7 },
      { month: "Jun", count: 6 },
      { month: "Jul", count: 10 },
      { month: "Aug", count: 2 },
    ];

    const createChart = () => {
      if (document.getElementById('points-chart')) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart(document.getElementById('points-chart') as ChartItem, {
          type: 'line',
          data: {
            labels: data.map((row) => row.month),
            datasets: [
              {
                label: currentUser.username ? currentUser.username : "Points",
                backgroundColor: '#7dd3fc',
                data: data.map((row) => row.count),
                borderColor: '#bae6fd',
                pointRadius: 6,
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                  display: false
              },
            },
          }
        });
      }
    };
    createChart();
  }, [chartStack])

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
                    <Segmented
                    options={['Total', 'Monthly']} 
                    value={chartStack} 
                    onChange={setChartStack as () => void}/>
                  </Row>
                  <canvas id="points-chart" className=""/>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
