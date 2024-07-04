import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, TimeSeriesScale} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, TimeSeriesScale);

// Function to generate random hex color
const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const Graphbis = ({ userCompleteResults }) => {
  
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
      tooltip: { // TO ADD EVENTS COMMENT IN HOVER
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label += ': ' + context.parsed.y;
            }
            const dataIndex = context.dataIndex;
            const data = userCompleteResults[dataIndex];
            if (data && data.COMMENTS) {
              label += ' - ' + data.COMMENTS[dataIndex];
            }
            return label;
          }}
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        type: 'time',
        time:{unit: 'day'}, //'day' //'month'
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

  // Extract labels and datasets from userCompleteResults
  const datasets = userCompleteResults.map(result => {
    const randomColor = getRandomColor();
    return {
      label: result.Name,
      data: result.DATES.map((date, index) => ({ x: date, y: result.VALUE[index] })),
      backgroundColor: randomColor,
      borderColor: randomColor,
      fill: true,
      tension: 0.1
    };
  });

  const labels = userCompleteResults.reduce((allDates, result) => allDates.concat(result.DATES), []);

  const data = {
    labels: labels,
    datasets: datasets
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graphbis;
