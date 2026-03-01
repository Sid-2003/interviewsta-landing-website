import React from 'react';
import { LineChart, ScatterChart } from '@mui/x-charts';


// {userScore,dataPoints}
const PercentileChart = ({userScore,dataPoints}) => {

  // Calculate percentiles from your data series
  const calculatePercentile = (score, sorted) => {
    const belowCount = sorted.filter(val => val < score).length;
    return ((belowCount + 1) / sorted.length) * 100;
  };

  const lesserThanUser = (score,sorted) => {
    const filtered = sorted.filter(value => value.score <= score)
    return filtered
  }


  // Generate percentile curve data
  const generatePercentileData = (sorted) => {
    const percentiles = [];
    
    for (let i = 0; i <= 100; i += 5) {
      const index = Math.floor((i / 100) * (sorted.length - 1));
      percentiles.push({
        percentile: i,
        score: sorted[index]
      });
    }
    return percentiles;
  };
  
  const sortedDataArray = dataPoints.sort((a, b) => a - b);
  const percentileData = generatePercentileData(sortedDataArray);
//   const lesserThanData = lesserThanUser(userScore, sortedDataArray);
  const lesserThanPercentileData = generatePercentileData(sortedDataArray);
  const lesserThanFilteredData = lesserThanUser(userScore, lesserThanPercentileData);
  const userPercentile = calculatePercentile(userScore, sortedDataArray);


  return (
    <div style={{ width: '100%'}} className="margin-auto">
      <LineChart
        height={250}

        series={[
          {
            data: percentileData.map(p => p.score),
            label: 'Score Distribution',
            color: '#1976d2',
            area: true,
            showMark: false,
          },
          {
            data: lesserThanFilteredData.map(p => p.score),
            label: `Your Score (${userPercentile.toFixed(1)}th percentile)`,
            color: '#ff4444',
            showMark: false,
            area: true,
          }
        ]}
        xAxis={[{
          data: percentileData.map(p => p.percentile),
          min: 0,
          max: 100,
        }]}
        // yAxis={[{ 
        //   label: 'Score',
        // }]}
        hideLegend={true}
        // className={`h-${size}`}
        
      />
    </div>
  );
};


export default PercentileChart;