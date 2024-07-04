import React from "react";
import { useState, useEffect } from "react";

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, TimeSeriesScale} from 'chart.js';
import {Switch} from 'antd';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, TimeSeriesScale);







// Function to generate random hex color
const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};




const Graph = ({userCompleteResults, loadAndConvertData, userData, userID, useCustomTypes, setUseCustomTypes}) => {


  useEffect(() => { 
   
  }, [userData, userID,useCustomTypes]);  // We rerender the graph is useCustomTpyes is changed 

console.log("GRAPH RECEIVED THIS COMPELTERESULTS", userCompleteResults);

  //const [viewDates, setViewDates] = useState(["2023-11-10", "2024-05-05"]);
  const [userFilteredResults,setUserFilteredResults] = useState(filterResultsByDate(userCompleteResults, "2023-01-01", "2024-03-05"));
  const [timeUnit, setTimeUnit] = useState("month");
  const [lastMode, setLastMode] = useState("YTD");
  const [groupByType, setGroupByType] = useState(false);

  



  //console.log("USERCOMPLETERESULTS DATA PASSED TO GRAPH COMPONENT", userCompleteResults)
  //const [datasets_state, setDatasets_state] = useState(0);
 
  if (!userCompleteResults || userCompleteResults.length === 0) {
    return <div>No data available</div>;
  }
 

  // WE CREAT A FUNCTION THAT FILTERS THE userCompleteResults Data in the date ranges we want to display
  function filterResultsByDate(results, minDate, maxDate) {
    // Convert minDate and maxDate to Date objects
    const minDateTime = new Date(minDate);
    const maxDateTime = new Date(maxDate);

    // Filter the results array based on the date range
    const filteredResults = results.filter(result => {
        // Convert the result's date string to a Date object
        const resultDate = new Date(result.DATE);

        // Check if the result's date is within the specified range
        return resultDate >= minDateTime && resultDate <= maxDateTime;
    });

    return filteredResults;
}


 // WE CREAT A FUNCTION THAT Groups userCompleteResults entries by type
 function groupResultsByType(results) {//REPLACE THIS CONTENT BA A FUNCTION THA RETURN A CONDENSED VERSION filteredRESULTS by TYPE
  // Convert minDate and maxDate to Date objects
  // const minDateTime = new Date("2023-01-01");
  // const maxDateTime = new Date("2024-03-05");

  // // Filter the results array based on the date range
  // const filteredResults = results.filter(result => {
  //     // Convert the result's date string to a Date object
  //     const resultDate = new Date(result.DATE);

  //     // Check if the result's date is within the specified range
  //     return resultDate >= minDateTime && resultDate <= maxDateTime;
  // });

  // Create a mapping object for faster lookup
  
  
  var conversionTable=userData.find(item => item.id === userID).AssetTypes;

  if (!useCustomTypes){
  conversionTable=userData.find(item => item.id === userID).AssetTypes_Default;// IF we chose to use default types, we should use de default types to make the conversions}
  //Also, we need to make sure the graph is rerenderd
  }
const conversionMap = {};
conversionTable.forEach(asset => {
  conversionMap[asset.Asset] = asset.Type;
});

// Function to convert results
const convertResults = (results, conversionMap) => {
  const convertedResults = [];

  results.forEach(item => {
    const convertedItem = {};

    Object.keys(item).forEach(key => {
      if (key in conversionMap) {
        const type = conversionMap[key];
        const value = parseFloat(item[key]);
        if (convertedItem[type]) {
          convertedItem[type] += value;
        } else {
          convertedItem[type] = value;
        }
      } else {
        convertedItem[key] = item[key];
      }
    });

    convertedResults.push(convertedItem);
  });

  return convertedResults;
};

const finalResults = convertResults(results, conversionMap);
console.log("FINAL RESULTS",finalResults);





  return finalResults;
}




  
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
        time:{unit: timeUnit}, //'day' //'month' //'year'
      
      },
      y: {
        stacked: true,
        beginAtZero: true, 
        // min: -1000000, 
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  };


  
  const labels = userFilteredResults.map(item => item.DATE);
  // const stocks = Object.keys(userFilteredResults[0]).filter(key => key !== 'DATE' && key !== 'Events'); // Get all stocks dynamically
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
   
    const randomColor=getRandomColor();
    return {
      label: stock,
      data: stockData,
      
      backgroundColor: randomColor,
      borderColor: randomColor, // Generate random color for each stock, 
      fill:true,
      tension: 0.1,
      pointRadius: 0, // Smaller dots
    pointHoverRadius: 10 // Smaller dots on hover
    };
  })

 // setDatasets_state(datasets);

  const data = {
    labels: labels,
    datasets:datasets,// datasets_state,
   
  };

  
function formatDate(date) { //Function to convert JS Date to `${year}-${month}-${day}` formT
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
const adjustViewDates=(mode)=> { //when we click on a view button to see week, month etc...
 
  
  let today = new Date();
  var lowerDate = new Date();
 
  switch (mode) {
    
    case "1W": 
        lowerDate.setDate(today.getDate() - 7);
        setTimeUnit("day");
        break;
    case "1M":
        lowerDate.setDate(today.getDate() - 31);
        setTimeUnit("week");
        break;
    case "YTD":
        lowerDate=new Date(today.getFullYear(), 0, 1);
        console.log(lowerDate)
        setTimeUnit("month");
        break;
    case "1Y":
        lowerDate.setDate(today.getDate() - 365);
        setTimeUnit("month");
          break;
          case "3Y":
            lowerDate.setDate(today.getDate() - 3*365);
            setTimeUnit("year");
              break;
              case "5Y":
                lowerDate.setDate(today.getDate() - 5*365);
                setTimeUnit("year");
                  break;
    default:
        console.log("Unknown mode");
        // Add your code for an unknown mode here
        break;
}
setLastMode(mode);
//setViewDates([formatDate(oneWeekBefore),formatDate(today)]);
setUserFilteredResults(filterResultsByDate(userCompleteResults, formatDate(lowerDate), formatDate(today)));//formatDate(lowerDate), formatDate(today)));
}
const handleGroupSwicth=(checked)=> {
  console.log("CHECKED VAR IS", checked)
  setGroupByType(checked);

 if (checked===true){ setUserFilteredResults(groupResultsByType(userFilteredResults));} //userCompleteResults
 else{
  console.log("SWITCH IS FALSE")
  
  adjustViewDates(lastMode); //we reset to the same mode as before, stored in lastMode state var
}
 
}


  return (
    <div className="MainGraph">
      <Line data={data} options={options} />
      <button onClick={() =>adjustViewDates("1W")}>1W</button>
      <button onClick={() =>adjustViewDates("1M")}>1M</button>
      <button onClick={() =>adjustViewDates("YTD")}>YTD</button>
      <button onClick={() =>adjustViewDates("1Y")}>1Y</button>
      <button onClick={() =>adjustViewDates("3Y")}>3Y</button>
      <button onClick={() =>adjustViewDates("5Y")}>5Y</button>
      <Switch onChange={(checked)=>{handleGroupSwicth(checked)}
            }/> <p>{!groupByType?"Group Assets by Type":"Show Individual assets" }</p>
    </div>
  );

 
};

export default Graph;
