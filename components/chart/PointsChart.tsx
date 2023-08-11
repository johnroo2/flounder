import { useProfile } from "@/hooks/useProfile";
import { Chart, ChartItem, registerables } from "chart.js";
import { useEffect, useRef, useState } from "react";
import moment from 'moment'
import 'chartjs-adapter-moment';
import { Empty, Spin } from "antd";
import type { Mode } from '@/types/Mode';
import { modeOptions } from '@/types/Mode';

Chart.register(...registerables)

export default function PointsChart({userData, mode, setPoints}:
    {userData:any, mode:Mode, setPoints?:any,}){

    const {get:getProfile} = useProfile();
    const chartRef = useRef<any>(null);
    const [rawData, setRawData] = useState<{points?:number, history?:Array<any>}>({})
    const [loading, setLoading] = useState<boolean>(false);

    const fetch = async() => {
      setLoading(true);
      if(userData && userData.username){
          try{
              const info = await getProfile(userData.username)
              const history = info.output.history.map((item:string) => JSON.parse(item))
              setRawData({points:info.output.points, history:history})
              if(setPoints){setPoints(info.output.points)}
              setLoading(false)
          }
          catch(err){
              console.log(err);
              setLoading(false)
          }
      }
    }

    const allTime = () => {
      const hoursDiff = moment().diff(moment(userData.createdAt), 'hours')

        if(hoursDiff < 48){ //2 days
          return {unit: 'hour', displayFormats: {hour: 'ddd HH:mm', format: 'ddd HH:mm'}}
        }
        if(hoursDiff < 48 * 7){ //2 weeks
          return {unit: 'day', displayFormats: {day: 'ddd MM/DD', format: 'ddd MM/DD'}}
        }
        else if(hoursDiff < 48 * 30){ //2 months
          return {unit: 'day', displayFormats: {day: 'MM/DD', format: 'MM/DD'}}
        }
        else if(hoursDiff < 48 * 60 * 12 * 2){ //8 years
          return {unit: 'month', displayFormats: {year: 'YYYY MM', format: 'YYYY MM'}}
        }
        else{ //8+ years
          return {unit: 'year', displayFormats: {year: 'YYYY', format: 'YYYY'}}
        }
    }

    const mapProps:{[key: Mode | string]: any} = {
      "Last 24 Hours":{props: {x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'ddd HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          stepSize: 6,
        },
      }},
      format:'ddd HH:mm'},
      "Last Week":{props: {x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'ddd MM/DD'
          }
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          stepSize: 2,
        },
      }},
      format:'ddd MM/DD'},
      "Last 28 Days":{props: {x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'ddd MM/DD'
          }
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          stepSize: 7,
        },
      }},
      format:'ddd MM/DD'},
      "Last 90 Days":{props: {x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MM/DD'
          }
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          stepSize: 18,
        },
      }},
      format:'MM/DD'},
      "Last Year":{props: {x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            day: 'YYYY MM'
          }
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          stepSize: 2,
        },
      }},
      format:'YYYY MM'},
      "All Time":{props: {x: {
        type: 'time',
        time: {
          ...allTime()
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          stepSize: 2,
        },
      }},
      format:allTime().displayFormats.format},
    }

    const handleData = (dataSet:Array<any>, mode:Mode) => {
      if(dataSet.length <= 1 || !userData){return []}

      const agg:any[] = [];
      let accumulatedValue = 0;
      dataSet.map(item => ({
        x: moment(item.date),
        y: item.value
      })).forEach(item => {
        accumulatedValue += item.y;
        agg.push({
          x: item.x,
          y: accumulatedValue
        });
      });

      const xLabels = [];
      if (mode === "All Time") {
        const hoursDiff = moment().diff(moment(userData.createdAt), 'hours') * 1.2;
        const interval = Math.ceil(hoursDiff / 8);

        for (let i = 0; i < (hoursDiff < 9 ? hoursDiff : 9); i++) {
            const now = moment();
            const mark = now.clone().subtract(i * interval, 'hours').startOf('hours');
            xLabels.push(mark.startOf('hour'));
          }
      }
      else if(mode === "Last 24 Hours"){
        for (let i = 0; i < 9; i++) {
          const now = moment();
          const mark = now.subtract(3*i, 'hours')
          xLabels.push(mark.startOf('hour'));
        }
      }
      else if(mode === "Last Week"){
        for (let i = 0; i < 8; i++) {
          const now = moment();
          const mark = now.subtract(i, 'days')
          xLabels.push(mark.startOf('day'));
        }
      }
      else if(mode === "Last 28 Days"){
        for (let i = 0; i < 8; i++) {
          const now = moment();
          const mark = now.subtract(4*i, 'days')
          xLabels.push(mark.startOf('day'));
        }
      }
      else if(mode === "Last 90 Days"){
        for (let i = 0; i < 10; i++) {
          const now = moment();
          const mark = now.subtract(9*i, 'days')
          xLabels.push(mark.startOf('day'));
        }
      }
      else if(mode === "Last Year"){
        for (let i = 0; i < 13; i++) {
          const now = moment();
          const mark = now.subtract(i, 'months')
          xLabels.push(mark.startOf('month'));
        }
      }
      const grouped:any[] = [];
      for(const label of xLabels){
        let max = agg[0]
        for(const datapoint of agg){ 
          if(label.isBefore(datapoint.x)){
            break;
          }
          max = datapoint
        }
        grouped.push({x:label, y:max.y})
      }
      if(grouped.length === 0){
        return grouped
      }
      grouped[0].y = rawData.points
      return grouped
    }

    useEffect(() => {
        fetch()
    }, [userData])

    useEffect(() => {
      if(rawData?.history){
        const chartData = handleData(rawData.history, mode)

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
                    data: chartData,
                    borderColor: "#7dd3fc",
                    pointRadius:6,
                    pointHoverRadius:10,
                    tension:0.05,
                    fill:true,
                    backgroundColor:"#f0f9ff",
                  }
                ]
              },
              options: {
                animation: {
                  duration: 0
                },
                plugins: {
                  legend: {
                      display: false
                  },
                  tooltip: {
                    callbacks: {
                      title: function (context) {
                          return moment(context[0].label).format(mapProps[mode].format);
                      },
                      label: function (context) {
                          return 'Points: ' + context.parsed.y;
                      }
                    },
                    displayColors:false
                  }
                },
                scales: {
                  ...mapProps[mode].props,
                  y: {
                    title: {
                    display: true,
                      text: 'Points'
                    },
                    min: 0,
                    ticks: {
                      stepSize: 1,
                      precision: 0,
                    }
                  },
                }
              }
            });
          }
        };
        createChart();
      }}, [rawData, mode])
      
    return(
      <>
        <Spin size="large" spinning={loading}>
          {rawData?.history?.length === 1 ?
            <Empty
            description={"Solve some problems to earn points!"}/>
            :
            <canvas id="points-chart" className="width-lockfull"/>
          }
        </Spin>
      </>
    )
}