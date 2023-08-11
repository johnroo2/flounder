import { Button, Row, Col, Typography, Card, List, Segmented, Select } from 'antd';
import useCurrentUser from '@/hooks/useCurrentUser';
import Link from 'next/link';
import PointsChart from '@/components/chart/PointsChart';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const { Title } = Typography;

export type Mode = "Last 24 Hours" | "Last Week" | "Last 28 Days" | "Last 90 Days" | "Last Year" | "All Time"
export const modeOptions = ["Last 24 Hours", "Last Week", "Last 28 Days", "Last 90 Days", "Last Year", "All Time"]

export default function Index() {
  const { currentUser: currentUser } = useCurrentUser();
  const [points, setPoints] = useState<number> (-1)
  const [mode, setMode] = useState<Mode>("Last 28 Days")
  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.username) {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  return (
    <>
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
    </>
  );
}
