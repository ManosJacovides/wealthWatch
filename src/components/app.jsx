import React from "react";

import Header from "./header.jsx";
import Footer from "./footer.jsx";
import SideBar from "./SideBar.jsx";
import Note from "./note.jsx";
import Table from "./table.jsx";
import Graph from "./Graph.jsx";
import Graphgpt from "./Graphgpt.jsx";
import Graphbis from "./Graphbis.jsx";
import { useState } from "react";
import jsonData from '../results_full.json';//'../results_simple.json';//"../results_full.json"
import emptyResults from '../results_full_empty.json';
import jsonDataBis from '../resultsbis.json'; 
import jsonEtoro from '../etoro.json';
import apiexample from '../apiresponsexample.json';
import { useEffect } from "react";

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Inputs from "../pages/inputs.jsx";
import Outputs from "../pages/output.jsx";
import Home from "../pages/home.jsx";

import Simulations from "../pages/simulations.jsx";
import supabase from "../supabase.jsx";





function App(){


    const[fetchError,setFetchError]=useState(null); // FROM SUBABASE TUTO
    const[userData,setUserData]=useState(null); // FROM SUBABASE TUTO

    const [userID, setUserID] = useState(1);


   
    
    //const [userCompleteResultsbis, setUserCompleteResultsbis] = useState(jsonDataBis);// THIS IS USED TO PASS THE SELECTED PROJECT FROM/TO PROJECT COMPONENT TO INPUT COMPONENT VIA APP.JSX PARENT COMPONENT

    //const [etoroImport, setEtoroImport] = useState(jsonEtoro);

    // const [stockAPIData, setStockAPIData] = useState(0);

    //const userCompleteResultsEmpty = emptyResults;



  function upateUserCompleteResultsEmpty(dataArray) { //To go to TODAY's DATE
    // Helper function to parse date string and get the latest date
    function getLatestDate(array) {
        return array.reduce((latest, item) => {
            let date = new Date(item.DATE);
            return date > latest ? date : latest;
        }, new Date(array[0].DATE));
    }

    // Get the latest date from the array
    let latestDate = getLatestDate(dataArray);

    // Get today's date
    let today = new Date();

    // Create new entries from the latest date to today
    let newDate = new Date(latestDate);
    newDate.setDate(newDate.getDate() + 1);  // Start from the day after the latest date

    while (newDate <= today) {
        dataArray.push({
            "DATE": newDate.toISOString().split('T')[0],
            "Events": ""
        });
        newDate.setDate(newDate.getDate() + 1);
    }

    return dataArray;
}

const [userCompleteResults, setUserCompleteResults] = useState(upateUserCompleteResultsEmpty(emptyResults));// THIS IS USED TO PASS THE SELECTED PROJECT FROM/TO PROJECT COMPONENT TO INPUT COMPONENT VIA APP.JSX PARENT COMPONENT
    

    
  


    // Create a function to make the API call
    async function fetchStockData(tickerSymbol) {
        try {
            // Define the API endpoint URL
            const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${tickerSymbol}&outputsize=full&apikey=G58ZI03MNRUNL7ND`; //manolisjacovides: F7P1YA3MGVQK1GXU PV: G58ZI03MNRUNL7ND
            
            // Make the API call using the fetch API
            const response = await fetch(apiUrl);
    
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Parse JSON data from the response
            const data = await response.json();
            
            // Log the API results
            // console.log("API RESULTS FOR", tickerSymbol);
            // console.log(data['Time Series (Daily)']);
    
            // Return the time series data
            return data['Time Series (Daily)'];
        } catch (error) {
            // Handle errors
            console.error('There was a problem with the fetch operation:', error);
            return null;
        }
    }



//const apiresult =fetchStockData('IBM')
const apiresult = apiexample;

const fetchUserData = async() => { // FIRST WE GET THE DATA FROM THE BACKEND
    const {data, error}=await supabase
    .from('users')
    .select() // WE SELECT ALL USERS
    if(error){setFetchError("Could Not Fetch Users Data");
    console.log("HERE IS THE ERROR", error);
    setUserData(null);}
    if(data){
        setUserData(data);
        setFetchError(null);
       
    }



//await convertEtoro(data[0].etoroData) // THEN WE RUN THE ETORO CONVERSION IN ORDER TO CREATE THE FINAL OUTPUT, using the etoro data taken from backend
//await convertEtoro(etoroImport); //if we want to take etora data locally
}

 useEffect(() => {
    
   
    fetchUserData()
    


    // const updateData = async () => { // We use an async function so that we trigger the rendering whenever we get a response from convertEtoro
    //   await convertEtoro(etoroImport);
    // };
    // updateData();
  }, []);

 
    return(
        <div>
            {/* <Header/>
            <SideBar/>
            
            <Note/>
            <Table/>
            <Graph  userCompleteResults={userCompleteResults}/>
          
            <Footer/> */}
            <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/inputs" element={<Inputs userData={userData} userID={userID} userCompleteResults={userCompleteResults} setUserCompleteResults={setUserCompleteResults} setUserData={setUserData} fetchUserData={fetchUserData} />}/>
                <Route path="/output" element={<Outputs userData={userData} userID={userID} userCompleteResults={userCompleteResults} setUserCompleteResults={setUserCompleteResults} setUserData={setUserData} fetchUserData={fetchUserData} upateUserCompleteResultsEmpty={upateUserCompleteResultsEmpty}/>}/>
                <Route path="/simulations" element={<Simulations userCompleteResults={userCompleteResults}/>}/>
            </Routes>
            
             
            </BrowserRouter>
           
            

        </div>
    );
}

export default App;

