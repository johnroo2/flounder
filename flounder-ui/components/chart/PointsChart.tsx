import { useProfile } from "@/hooks/useProfile";
import { Chart, ChartItem, registerables } from "chart.js";
import { useEffect, useRef, useState } from "react";
import moment from 'moment'
import 'chartjs-adapter-moment';
import { Spin } from "antd";

Chart.register(...registerables)

export default function PointsChart({currentUser}:
    {currentUser:any}){

    const {get:getProfile} = useProfile();
    const chartRef = useRef<any>(null);
    const [rawData, setRawData] = useState<{points?:number, history?:Array<any>}>({})
    const [loading, setLoading] = useState<boolean>(false);

    const fetch = async() => {
      setLoading(true);
      if(currentUser){
          try{
              const info = await getProfile(currentUser.username)
              console.log(info)
              setRawData({points:info.output.points, history:info.output.history})
              setLoading(false)
          }
          catch(err){
              console.log(err);
              setLoading(false)
          }
      }
    }

    useEffect(() => {
        fetch()
    }, [currentUser])

    useEffect(() => {
      if(rawData?.history){
        const parsedData = rawData.history.map(item => ({
          x: moment(item.date),
          y: item.value
        }));

        console.log(parsedData)

        const aggregatedData:any[] = [];
        let accumulatedValue = 0;
        parsedData.forEach(item => {
          accumulatedValue += item.y;
          aggregatedData.push({
            x: item.x,
            y: accumulatedValue
          });
        });

        const createChart = () => {
          if (document.getElementById('points-chart')) {
            if (chartRef.current) {
              chartRef.current.destroy();
            }
    
            chartRef.current = new Chart(document.getElementById('points-chart') as ChartItem, {
              type: 'line',
              data: {
                datasets: [
                  {
                    label: 'Points',
                    data: aggregatedData,
                    borderColor: "#7dd3fc",
                    pointRadius:6,
                    tension:0.05,
                    fill:true,
                    backgroundColor:"#f0f9ff",
                  }
                ]
              },
              options: {
                plugins: {
                  legend: {
                      display: false
                  },
                },
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      unit: 'minute',
                      displayFormats: {
                        minute: 'HH:mm'
                      }
                    },
                    title: {
                      display: true,
                      text: 'Time'
                    }
                  },
                  y: {
                    title: {
                    display: true,
                      text: 'Points'
                    },
                    grace:"20%",
                    ticks: {
                      stepSize: 1,
                      precision: 0,
                    },
                  }
                }
              }
            });
          }
        };
        createChart();
      }}, [rawData])
      
    return(
      <>
        <Spin size="large" spinning={loading}>
          <canvas id="points-chart" className=""/>
        </Spin>
      </>
    )
}