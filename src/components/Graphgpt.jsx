import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, TimeSeriesScale } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, TimeSeriesScale);

const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const Graph = ({ userCompleteResults }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (userCompleteResults && userCompleteResults.length > 0) {
      const filterResultsByDate = (results, minDate, maxDate) => {
        const minDateTime = new Date(minDate);
        const maxDateTime = new Date(maxDate);
        return results.filter(result => {
          const resultDate = new Date(result.DATE);
          return resultDate >= minDateTime && resultDate <= maxDateTime;
        });
      };

      const userFilteredResults = filterResultsByDate(userCompleteResults, "2020-11-10", "2024-05-05");

      const labels = userFilteredResults.map(item => item.DATE);

      const stocks = userFilteredResults.reduce((allStocks, result) => {
        Object.keys(result).forEach(key => {
          if (key !== 'DATE' && key !== 'Events' && !allStocks.includes(key)) {
            allStocks.push(key);
          }
        });
        return allStocks;
      }, []);

      const datasets = stocks.map(stock => {
        const stockData = userFilteredResults.map(item => item[stock]);
        const randomColor = getRandomColor();
        return {
          label: stock,
          data: stockData,
          backgroundColor: randomColor,
          borderColor: randomColor,
          fill: true,
          tension: 0.1
        };
      });

      setData({
        labels: labels,
        datasets: datasets,
      });
    }
  }, [userCompleteResults]);

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Stacked Line Chart'
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label += ': ' + context.parsed.y;
            }
            const event = userCompleteResults[context.dataIndex]['Events'];
            if (event) {
              label += ' - ' + event;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        type: 'time',
        time: { unit: 'year' },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graph;
