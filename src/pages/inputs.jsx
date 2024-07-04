

import React from "react";

import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import SideBar from "../components/SideBar.jsx";
import Note from "../components/note.jsx";
import Table from "../components/table.jsx";
import Graph from "../components/Graph.jsx";
import Graphgpt from "../components/Graphgpt.jsx";
import Graphbis from "../components/Graphbis.jsx";
import { useState } from "react";
import jsonData from '../results_full.json';//'../results_simple.json';//"../results_full.json"
import emptyResults from '../results_full_empty.json';
import jsonDataBis from '../resultsbis.json'; 
import jsonEtoro from '../etoro.json';
import apiexample from '../apiresponsexample.json';
import { useEffect } from "react";

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Outputs from "../pages/output.jsx";
import Home from "../pages/home.jsx";
import ReadOnlyRow from "../components/ReadOnlyRow.jsx";
import supabase from "../supabase.jsx";
import * as XLSX from 'xlsx'





function Inputs({userData,userCompleteResults, setUserCompleteResults,userID, setUserData, fetchUserData}){

    //const [userCompleteResults, setUserCompleteResults] = useState(emptyResults);// THIS IS USED TO PASS THE SELECTED PROJECT FROM/TO PROJECT COMPONENT TO INPUT COMPONENT VIA APP.JSX PARENT COMPONENT
    
    
    //const [userCompleteResultsbis, setUserCompleteResultsbis] = useState(jsonDataBis);// THIS IS USED TO PASS THE SELECTED PROJECT FROM/TO PROJECT COMPONENT TO INPUT COMPONENT VIA APP.JSX PARENT COMPONENT

    const [etoroImport, setEtoroImport] = useState(jsonEtoro);

    // const [stockAPIData, setStockAPIData] = useState(0);

    const userCompleteResultsEmpty = emptyResults;


    

   
  //   if(userData) // WE RETRIEVE USERCOMPLETE RESULTS FROM BACKEND AND SET IT
  //   {
  //    const userCompleteResultsTemp=userData.find(item => item.id === userID).completeData;
  //   console.log("userCompleteResults RETRIEVED FROM BACKEND", userCompleteResultsTemp)
  //   setUserCompleteResults(userCompleteResultsTemp)
  // }

    
  


    // // Create a function to make the API call for stock data
    // async function fetchStockData(tickerSymbol) {
    //     try {
    //         // Define the API endpoint URL
    //         const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${tickerSymbol}&outputsize=full&apikey=G58ZI03MNRUNL7ND`; //manolisjacovides: F7P1YA3MGVQK1GXU PV: G58ZI03MNRUNL7ND
            
    //         // Make the API call using the fetch API
    //         const response = await fetch(apiUrl);
    
    //         // Check if the response is successful
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    
    //         // Parse JSON data from the response
    //         const data = await response.json();
            
    //         // Log the API results
    //         // console.log("API RESULTS FOR", tickerSymbol);
    //         // console.log(data['Time Series (Daily)']);
    
    //         // Return the time series data
    //         return data['Time Series (Daily)'];
    //     } catch (error) {
    //         // Handle errors
    //         console.error('There was a problem with the fetch operation:', error);
    //         return null;
    //     }
    // }

   
    // async function updateBackendUserCompleteResults(userCompleteResults,userID){
    //   try{
    //   const {data,error}=await supabase.from('users').update({completeData: userCompleteResults}).eq('id',userID) //userCompleteResults
   
    // if(data){console.log(data)}}
    // catch(error){console.log(error)} }

    // async function updateBackendUserManualData(userManualData,userID){
    //   try{
    //   const {data,error}=await supabase.from('users').update({userManualData: userManualData}).eq('id',userID) //userCompleteResults
   
    // if(data){console.log(data)}}
    // catch(error){console.log(error)} }

    // async function updateBackendUserCompleteResults(userCompleteResults, userID) {
    //   try {
    //     const { data, error } = await supabase
    //       .from('users')
    //       .update({ completeData: userCompleteResults })
    //       .eq('id', userID);
    
    //     if (error) throw error;
    //     if (data) console.log(data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    
    async function updateBackendUserManualData(manualData, userID) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({manualData: manualData })
          .eq('id', userID);
    
        if (error) throw error;
        if (data) console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    async function updateBackendUserPublicData(publicData, userID) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({publicData: publicData })
          .eq('id', userID);
    
        if (error) throw error;
        if (data) console.log(data);
      } catch (error) {
        console.log(error);
      }
    }



//const apiresult =fetchStockData('IBM')
const apiresult = apiexample;
//console.log('API RESULT IS:',apiresult);
// setStockAPIData(apiresult);


   
// async function convertEtoro(etoroImport){ //GOAL: WE CONVERT THE ETORO RAW DATA TO AN INDEPENTEND RESULTS_ETORO OBJECT // WE put async so it waits for the api response

// //const etoroResults=userCompleteResultsEmpty;// WE create our output results array with all dates prefilled

// const etoroResults = JSON.parse(JSON.stringify(userCompleteResultsEmpty)); // Create a deep copy of userCompleteResultsEmpty, if we simply do const etoroResults=userCompleteResultsEmpty; then we will change userCompleteResultsEmpty when we change etoroResults!
// //For object in etoro.json, 
//                 //etoroImport.forEach(async (obj) => { // WE put async so it waits for the api response
//                     for (const obj of etoroImport) {
//                         //console.log(obj);
// // Convert the date to the desired format "YYYY-MM-DD"
//    const dateParts = obj.Date.split(' ')[0].split('/');
//    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;

//     // Find the corresponding object in etoroResults
//     const correspondingObject = etoroResults.find(item => item.DATE === formattedDate);

//     // Log the corresponding object if found
//     if (correspondingObject) {
//         //console.log(correspondingObject);



        
        
        
//         //2)  SWITCH 

//          switch (obj.Type) {
//             case "Open Position":
//             case "Position closed":// We trigger this for both OPEN and Close Positions

//                 //console.log("Found an Open Position:");
//                // 1)We retrieve the ticker symbol from etoroImport object
//                const stockName = obj.Details.split('/')[0];

//                // 2) We retrieve the number of shares from etoroImport object
//                const numberOfShares=obj.Units;
            
//                // 3) We write the event in etoroResults object based on the info we retrieved at the right date (corresondingObject)
//                if (obj.Type=="Open Position") {correspondingObject.Events=+("Bought "+numberOfShares+" units of "+stockName);} // HERE WE ADD to the existing string (because there can be events from other stocks/assests coexisting, we don't want to overwrite)
//                if (obj.Type=="Position closed") {correspondingObject.Events=+("Sold "+numberOfShares+" units of "+stockName);}
//                //console.log(correspondingObject.Events);

//                // 4)We Do API call to get time series for stockName and retrieve the price for each date

//                //const stockAPIData= await fetchStockData(stockName); //UNCOMMENT IF WE REALLY WANT TO MAKE THE API CALL
//               const stockAPIData=apiexample; // COMMENT IF WE WANT TO MAKE TESTS WITHOUT USING API LIMIT, using our json example

//                //console.log("STOCK API DATA INSIDE OUR CONVERSION FUNCTION:",stockAPIData);
//             // 5 )for all datesF AFTER (and including) DATE  in etoroResults:  

//             var stockPrice =0;
//                     for (const entry of etoroResults) {
                        
//                         if (entry.DATE >= formattedDate) {
//                               // 1) We calculate the value of the stock: const stockValue= PRICE*numberOfShares , PRICE taken from API data

//                               if  (stockAPIData[entry.DATE]) { // BECAUSE SOME DATES THERE IS NO DATA AVAILABLE (WEEKENDS ETC) OR THE date is too early and tehre is not data, in that case we get 0 BECAUSE THE LOOP STARTS AT EARLIER DATES
//                              stockPrice = stockAPIData[entry.DATE]["1. open"];
//                               //const stockPrice=stockAPIData.formattedDate[0];
//                               //console.log(`WE RETRIEVE THE PRICE FOR DATE ${entry.DATE } which is ${stockPrice}`);
//                             }

//                               else {
//                                 //console.log(`No data available so WE Use the Previous day which is ${stockPrice}`);
//                             }
                             

//                               const stockValue=(numberOfShares*stockPrice).toString();
                            
//                                     // 2) We populate the etororesult object with the stock and its price at each date:
//                                     //      IF "StockName"DOES NOT ALREADY EXIST in datesF object: add element '"stockName":"stockValue"           
//                                    //      IF "StockName" EXISTS in datesF object: '"stockName" value = '"stockName" value + stockValue

//                                             // Check if the property "X" exists in the entry object
//                                             if (stockName in entry) {
//                                                 // If the property exists, add  to its value
                                                
//                                                 if (obj.Type=="Open Position") {
                                                    
//                                                     const currentValue=parseFloat(entry[stockName ]); // WE CONVERT TO FLOAT SO WE CAN DO THE OPERATION
//                                                     const valueToAdd=parseFloat(stockValue); // WE CONVERT TO FLOAT SO WE CAN DO THE OPERATION
//                                                     const newValue=currentValue+valueToAdd;

//                                                     entry[stockName ] =newValue.toString(); // we reassign to the entry the new value converted to Float
//                                                     //entry[stockName ] +=stockValue ;
                                                
//                                                 // WE CONVERT TO STRING BECAUSE THATS HOW THE GRAPH READS IT
//                                                 entry[stockName] = entry[stockName].toString();
//                                                 //console.log(entry);
//                                                 } // TO DO: ADAPT SO IT CAN REALLY ADD: CONVERT TO FLOAT THEN TO STRING AGAIN
//                                                 if (obj.Type=="Position closed"){entry[stockName ] -=stockValue // HERE WE DONT NEED TO CONVERT, BECAUSE JS AUTOMATICALLY DOES THE OPERATIONS WITH "MINUS" OPERATOR
//                                                     // WE CONVERT TO STRING BECAUSE THATS HOW THE GRAPH READS IT
//                                                 entry[stockName] = entry[stockName].toString();

//                                                     //IF WE HAVE NO STOCK LEFT or we sell more than what the system thought we have (So the difference is almost 0, we have less than 10USD); WE CAN REMOVE THAT STOCK FROM OUR RESULTS AND OUR GRAPHS
//                                                     if (entry[stockName ]<5){

//                                                         delete entry[stockName];
                                                        
//                                                     }
                                                    
//                                                     ;} 
                                                
//                                             } else {
//                                                 if (obj.Type=="Open Position") {// For open positions, If the property doesn't exist, create it and assign the value Y
//                                                 entry[stockName] = stockValue;
//                                                 //console.log(entry);
//                                                // WE CONVERT TO STRING BECAUSE THATS HOW THE GRAPH READS IT
//                                                entry[stockName] = entry[stockName].toString();}

//                                                // For closed positions, we don't do anything if the property does not exists

                                            

                                               
//                                             }
                                
//                                         }

//                                 //NEXT STEPS: 
//                               //  1) DONE -  TEST IF THE etoroResults object can be rendered in the graph component to see if and how it works. DO MANY TESTS; CHECK THAT BTC API WORKS (strange values), etc...
//                                 // 2) DONE - DO SAME as OPEN POSITION WITH POSITION CLOSED (PUT IN SAME SWITCH AND AD IFs ?) AND SEE WHAT HAPPENS WHEN THE WHOLE POSITION IS CLOSED?
//                                 //LATER
//                                 // 3) DO DIVIDEND: WRITE THE TOTAL DIVIDEND SOMEWHERE IN A DIVIDEDN TABLE 
//                                 // 4) DO GRAPH OBJECT ADAPTATIONS (in graph component), ETC
              
                            
//                         }

                                  
//               break;
//             // case "Position closed":
//             //   // Handle case for "Position closed"
//             //   console.log("Position closed");
//             //   break;
//             case "Dividend":
//               // Handle case for "Dividend"
//               console.log("Dividend");
//               break;
//             default:
//               // Handle default case (if "Type" doesn't match any of the cases)
//               console.log("Other type");
//               break;
//           }
//                 //        
                

                               

//                  //                 FOR CLOSED POSITION / OPEN ADD CASH CONSIDERATION?
                                   
//                                       //   4)  IF "ETORO CASH" EXISTS in datesF object: '"ETORO CASH" value = "BALANCE" value taken directly from the etoro.json object
//                                       //       IF "ETORO CASH" DOES NOT EXISTS, add element "ETORO CASH" in datesF object, with value:  "BALANCE" value taken directly from the etoro.json object
            
//                                       //IF DIVIDEND: ......
//                                      //IF INTEREST, WITDRAW, DEPOSIT, ADJUSTMENT: ......add comment + update Balance


//                                       // SEE HOW WE COULD ALSO CREATE A: UNKOWN ETORO element which is the difference between all ETORO values (Balance and stocks considered) and "Realized Equity" data from et



//                                     //   console.log("ETORO RESUTLTS",etoroResults);
//                                     //   console.log("USER COMPLETE RESULTS:", userCompleteResults);
                                      




//     } else { //IF the Date was not found in etoro empty template
//         console.log(`No corresponding object found for date ${formattedDate}`);
//     }
// //console.log("ETORO RESULTS", etoroResults);
//     //setUserCompleteResults(etoroResults);


//     const mergedResults= mergeResults(userCompleteResults,etoroResults); // This adds all etoro considerations in a usercompleteResults clone.
//     setUserCompleteResults(mergedResults); // We then assign this clone to userCompleteResults Variable


//     //setUserCompleteResults([...etoroResults])
 
//     //console.log("we setUserCOmpelteResults")
//     //setUserCompleteResults(jsonData);

//     // WE THEN SEND THE COMPLETE UPDATED RESULT TO THE BACKEND
//     console.log("MERGED RESULTS AFTER RUNUNG ETORO:",userCompleteResults);//userCompleteResults
//     updateBackendUserCompleteResults(mergedResults,userID);

   
// }; //)
               

// }


// function convertManualAsset(manualAsset){
    
    

//     //const manualResults=userCompleteResultsEmpty;// WE create our output results array with all dates prefilled
//     //console.log("MANUALRESULTS CLASSIQUE", manualResults)
//     const manualResults = JSON.parse(JSON.stringify(userCompleteResultsEmpty)); // Create a deep copy of userCompleteResultsEmpty, if we simply do const etoroResults=userCompleteResultsEmpty; then we will change userCompleteResultsEmpty when we change etoroResults!
//     console.log("MANUALRESULTS JSONPART DEEP",JSON.parse(JSON.stringify(userCompleteResultsEmpty)));
//     for (const obj of manualAsset.PriceHistory) {
//         console.log(obj)
//         const correspondingObject = manualResults.find(item => item.DATE === obj.Date);

//         if (correspondingObject) {
//         console.log("Found Corresponding object",correspondingObject )

//             for (const entry of manualResults) {
                            
//                 if (entry.DATE >= obj.Date) {
//                     entry[manualAsset.Name ] =obj.Valuation;
                    
//                 }
//             }

//         }
//     }
//     console.log("USERCOMPELTE RESULTS BEFORE MERGING FUNCTION",userCompleteResults)
//     console.log("MANUAL RESULTS BEFORE MERGING FUNCTION",manualResults)
//     const mergedResultsManual= mergeResults(userCompleteResults,manualResults); // This adds the manual consideration in a usercompleteResults clone.
//     console.log("MANUAL RESULTS AFTER MERGING FUNCTION",mergedResultsManual)
//     setUserCompleteResults(mergedResultsManual); // We then assign this clone to userCompleteResults Variable
     
   
//    // WE THEN SEND THE COMPLETE UPDATED RESULT TO THE BACKEND
//     updateBackendUserCompleteResults(mergedResultsManual,userID);//userCompleteResults 



// }


// function mergeResults(data1, data2){// We merge the smallData results (i.e etoro or manually added stuff) to the userCompleteResults Result Object, also we here we need to do an API call to update the user DB in backend
       
//         // For each date of the small data, add smallData assets TO UserCompleteResults at that date object (Ex: Stock J from etoro added to the list of stocks for date X)

    
//             // Create a dictionary for quick lookup of data2 by DATE
//             const data2Dict = {};
//             data2.forEach(item => {
//                 data2Dict[item.DATE] = item;
//             });
        
//             // Iterate through data1 and merge corresponding objects from data2
//             const mergedData = data1.map(item => {
//                 const data2Item = data2Dict[item.DATE];
//                 if (data2Item) {
//                     return { ...item, ...data2Item };
//                 }
//                 return item;
//             });
        
//             return mergedData;
        
       
//     }

  

  

//   useEffect(() => {convertEtoro(etoroImport);
// //     const etoroResults=convertEtoro(etoroImport);
// //   //setUserCompleteResults(etoroResults);
// //console.log("We called convertEtoro function")


 
//  }, []);


 useEffect(() => {
    
  }, [userData]); // WE ADD USER DATA HERE SO THAT EVERYTIME WE FETCH DATA FROM BACKEND AND UPDATE USERDATA, THEN THE PAGE RERENDERS ARE SHOWS UP TO DATE INFO

  
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(null);
  const [selectedAssetType, setSelectedAssetType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData]=useState(null)

  const [editIsNewAsset, setEditIsNewAsset] = useState(false);
  

  const handleSelectManualAsset = (asset, index) => {
    setSelectedAsset(asset);
    setSelectedAssetIndex(index);
    setSelectedAssetType("Manual");
    console.log("CLICKED ON ASSET");
    console.log(asset.Name);
    console.log(selectedAssetType);
    console.log(index);


    // if(userData){//We want to run  the conversion functions only when we already have our userCompleteresults from the backend in order to do the merge
  
     
    // //WE RUN THE CONVERT FUNCTIONS; WHICH NEED THE USERCOMPLETERESULTS UPDATED TO FUNCTION
    //     const updateData = async () => { // We use an async function so that we trigger the rendering whenever we get a response from convertEtoro
    //        //await convertEtoro(etoroImport);
    //       //await convertEtoro(userData.etoroData) 
    //       convertManualAsset(asset); // WE ALSO TRIGGER CONVERT MANUAL ASSET FOR NOW
    //     };
    //     updateData();}   
};



const handleSelectPublicAsset = (asset,index) => {
  setSelectedAsset(asset);
  setSelectedAssetIndex(index);
  setSelectedAssetType(asset.Name);
  console.log("CLICKED ON ASSET");
  console.log(asset.Name);
  console.log(selectedAssetType);
  console.log(index);


  // if(userData && asset.Name==="eToro"){//We want to run  the conversion functions only when we already have our userCompleteresults from the backend in order to do the merge

   
  // //WE RUN THE CONVERT FUNCTIONS; WHICH NEED THE USERCOMPLETERESULTS UPDATED TO FUNCTION
  //     const updateData = async () => { // We use an async function so that we trigger the rendering whenever we get a response from convertEtoro
  //        await convertEtoro(etoroImport);
  //       //await convertEtoro(userData.etoroData) 
  //       //convertManualAsset(asset); // WE ALSO TRIGGER CONVERT MANUAL ASSET FOR NOW
  //     };
  //     updateData();}
  
   
};

const handleAddNewManualAsset  = () => {
  setEditMode(true);
  setEditIsNewAsset(true);
  const newEmptyAsset={
    Name: "",
    Type: "",
    PriceHistory: [
      {
        "Date": "YYYY-MM-DD",
        "Valuation": ""
      },
      {
        "Date": "YYYY-MM-DD",
        "Valuation": ""
      }]}
    setEditFormData(newEmptyAsset);


}

const handleDeleteManualAsset  = () => {

  const updatedManualData = [...userData.find(item => item.id === userID).manualData];


  // Remove the object at index selectedAssetIndex from updatedManualData
   updatedManualData.splice(selectedAssetIndex, 1);


  updateBackendUserManualData(updatedManualData,userID)
  console.log("exported this to backend", updatedManualData)

 //We alse refetch user Data so that the written names are updated (Updates userData variable by retrieving it from backend)
   fetchUserData(); 
   //window.location.reload();

   setSelectedAsset(null);
   setSelectedAssetIndex(null);


}

const handleEditManualAsset  = (asset) => {
  setEditMode(true);
  setEditIsNewAsset(false);

  // Create a deep copy of the selected asset
  const assetCopy = JSON.parse(JSON.stringify(asset));
  setEditFormData(assetCopy);
}


const handleEditFormChange  = (event) => {
  event.preventDefault();
  const fieldName=event.target.getAttribute("name");
  const fieldValue=event.target.value;
  const newFormData= {...editFormData}
  newFormData[fieldName]=fieldValue;
  setEditFormData(newFormData);
  console.log("Edit form data",editFormData);
}

const handleEditFormChangePriceHistory = (event, index) => {
  event.preventDefault();
  const fieldName=event.target.getAttribute("name");
  const fieldValue=event.target.value;
  // Create a copy of the current editFormData
  const newFormData = JSON.parse(JSON.stringify(editFormData));
  newFormData.PriceHistory[index][fieldName]=fieldValue;
  setEditFormData(newFormData);
  console.log("Edit form data price history",editFormData.PriceHistory[index]);
  console.log("Selected Asset:",selectedAsset);
}

const handleEditFormChangeEToro = (event, index) => {
  event.preventDefault();
  const fieldName=event.target.getAttribute("name");
  console.log("FIELDNAME",fieldName);
  const fieldValue=event.target.value;



  // Create a copy of the current editFormData
  const newFormData = JSON.parse(JSON.stringify(editFormData));
  newFormData.Data[index][fieldName]=fieldValue;
  setEditFormData(newFormData);
  console.log("Edit form data Etoro",editFormData.Data[index]);
  console.log("Selected Asset:",selectedAsset);
}

const handleAddNewPricePoint = () => {

  // Create a copy of the current editFormData
  const newFormData = JSON.parse(JSON.stringify(editFormData));


  const lastIndex = newFormData.PriceHistory.length - 1;
  const newPricePoint = {
    Date: newFormData.PriceHistory[lastIndex]["Date"],
    Valuation: newFormData.PriceHistory[lastIndex]["Valuation"]
  }


  // //We add a new pirce Point in new form data
  // newFormData.PriceHistory= {
  //   ...newFormData.PriceHistory,
  //   newPricePoint
  // };

  newFormData.PriceHistory.push(newPricePoint);

  setEditFormData(newFormData);

  console.log("ADD NEW PRICE POINT NOW GIVES FOLLOWING EDIT FORM DATA", newFormData);

}

const handleAddNewTransaction = () => {

  // Create a copy of the current editFormData
  const newFormData = JSON.parse(JSON.stringify(editFormData));


  const lastIndex = newFormData.Data.length - 1;
  const newTransaction = {
    "NWA": newFormData.Data[lastIndex]["NWA"],
        "Date": newFormData.Data[lastIndex]["Date"],
        "Type": newFormData.Data[lastIndex]["Type"],
        "Units": newFormData.Data[lastIndex]["Units"],
        "Amount": newFormData.Data[lastIndex]["Amount"],
        "Balance": newFormData.Data[lastIndex]["Balance"],
        "Details": newFormData.Data[lastIndex]["Details"],
        "Asset type": newFormData.Data[lastIndex]["Asset type"],
        "Position ID": newFormData.Data[lastIndex]["Position ID"],
        "Realized Equity":newFormData.Data[lastIndex]["Realized Equity"],
        "Realized Equity Change": newFormData.Data[lastIndex]["Realized Equity Change"]
  }


  // //We add a new pirce Point in new form data
  // newFormData.PriceHistory= {
  //   ...newFormData.PriceHistory,
  //   newPricePoint
  // };

  newFormData.Data.push(newTransaction);

  setEditFormData(newFormData);

  console.log("ADD Transaction NOW GIVES FOLLOWING EDIT FORM DATA", newFormData);

}





const handleCancelEditManualAsset=(asset)=> {
  const initialAsset=asset;
  setEditFormData(initialAsset);
  setEditMode(false);
}

const handleClickSaveEditManualAsset =()=> {
  setSelectedAsset(editFormData);


  
  const updatedManualData = [...userData.find(item => item.id === userID).manualData];
  updatedManualData[selectedAssetIndex] = editFormData;


  updateBackendUserManualData(updatedManualData,userID)
  console.log("exported this to backend", updatedManualData)

 //We alse refetch user Data so that the written names are updated (Updates userData variable by retrieving it from backend)
   fetchUserData(); 
   //window.location.reload();


  setEditMode(false);

}
const handleClickSaveEditPublicAsset =()=> {
  setSelectedAsset(editFormData);


  
  const updatedPublicData = [...userData.find(item => item.id === userID).publicData];
  updatedPublicData[selectedAssetIndex] = editFormData;


  updateBackendUserPublicData(updatedPublicData,userID)
  console.log("exported this to backend", updatedPublicData)

 //We alse refetch user Data so that the written names are updated (Updates userData variable by retrieving it from backend)
   fetchUserData(); 
   //window.location.reload();


  setEditMode(false);

}

const handleClickCreateManualAsset=()=> {
  setSelectedAsset(editFormData);
  const updatedManualData = [...userData.find(item => item.id === userID).manualData];
  
  //WE PUSH THE NEW DATA TO THE MANUALDATAARRAY TO SEND TO BACKEND
  updatedManualData.push(editFormData);
  updateBackendUserManualData(updatedManualData,userID)
  console.log("exported this to backend", updatedManualData)

   //We alse refetch user Data so that the written names are updated (Updates userData variable by retrieving it from backend)
   fetchUserData(); //DOES NOT work all the time, so we reload the page so it updates
   //window.location.reload()


   setEditMode(false);
}

const handleEtoroXLSX= async(event)=>{
  const file=event.target.files[0];
  const data=await file.arrayBuffer();
  const workbook=XLSX.read(data);


  const worksheet= workbook.Sheets[workbook.SheetNames[2]]; //WE want the account activity sheet which is the 3rd sheet
  const jsonData=XLSX.utils.sheet_to_json(worksheet);
  console.log(jsonData);



 // We create a new  updatedPublicData that we send to backend
  const updatedPublicData = [...userData.find(item => item.id === userID).publicData]; //we duplicate the current PublicData Object 
  updatedPublicData[selectedAssetIndex].Data = jsonData;  //In the publicDataObject, we adapt the etoroObject  (at index SelectedAssetIndex) to give it the updated Data 
console.log('UPDATEPUBLICDATA',updatedPublicData );
updateBackendUserPublicData(updatedPublicData,userID)
  //We alse refetch user Data so that the written names are updated (Updates userData variable by retrieving it from backend)
  fetchUserData(); 
  //window.location.reload();


 setEditMode(false);



  
}


  
  
  return (
    <div>
       <Header/>
        <div className="container">
            <SideBar/>

            <div className="content"><h1>INPUTS PAGE</h1>

      {userData && (<h1>{userData.map(user=>(<p key={user.id}>{user.id}</p>))}</h1>)}



      <div className="bigassetsbox">

      <div className="publicassetsbox">
      <p className="boxtitle">Public Assets</p>
     
     {userData && ( <div className="assetsbox">{userData.find(item => item.id === userID).publicData.map((asset,index)=>(<button  key={index} className="asset" onClick={() => handleSelectPublicAsset(asset,index)}><p>{asset.Name}</p></button>))} </div>  )} 
              
               </div>  
     
    <div className="privateassetsbox">

        <p className="boxtitle">Private Assets</p>
     
     {userData &&( <div className="assetsbox">{userData.find(item => item.id === userID).manualData.map((asset,index)=>(<button key={index} className="asset"  onClick={() => handleSelectManualAsset(asset,index)}>{asset.Name}</button>))} <button className="new asset" onClick={() => handleAddNewManualAsset()}>Add New</button></div>  )} 
              
               </div>  

               </div>


    { selectedAsset && selectedAssetType==="Manual"  && editMode===false &&(
    <div className="assetdetails">  
     <p>{selectedAsset.Name}</p>
     <p>{selectedAsset.Type}</p>

     <table border="1">
      <thead>
        <tr>
          <th>Date</th>
          <th>Valuation</th>
        </tr>
      </thead>
      <tbody>
        {selectedAsset.PriceHistory.map((item, index) => (
          <tr key={index}>
            <td>{item.Date}</td>
            <td>{item.Valuation}</td>
          </tr>
        ))}
      </tbody>
    </table>

   <div> <button className="new asset" onClick={() => handleEditManualAsset(selectedAsset)} >Edit</button> <button className="new asset" onClick={() => handleDeleteManualAsset(selectedAsset)}>Delete</button></div>


     </div>    )}


     { ((selectedAsset && selectedAssetType==="Manual")|| editIsNewAsset )  && editMode===true  &&(
    <div className="assetdetails"> 
     <td><input value={editFormData.Name}type="text"  maxLength="45" required="required" placeholder={editFormData.Name} name="Name" onChange={handleEditFormChange}></input></td> 
     <td><input value={editFormData.Type}type="text"  maxLength="45" required="required" placeholder={editFormData.Type} name="Type" onChange={handleEditFormChange}></input></td> 
    

     <table border="1">
      <thead>
        <tr>
          <th>Date</th>
          <th>Valuation</th>
        </tr>
      </thead>
      <tbody>
        {editFormData.PriceHistory.map((item, index) => (
          <tr key={index}>
            <td><input value={editFormData.PriceHistory[index].Date}type="text"  maxLength="10" required="required" placeholder={editFormData.PriceHistory[index].Date} name="Date" onChange={(event) => handleEditFormChangePriceHistory(event, index)}></input></td>
            {/* <td>{item.Date}</td> */}
            <td><input value={editFormData.PriceHistory[index].Valuation}type="text"  maxLength="15" required="required" placeholder={editFormData.PriceHistory[index].Valuation} name="Valuation" onChange={(event) => handleEditFormChangePriceHistory(event, index)}></input></td>
            {/* <td>{item.Valuation}</td> */}
          </tr>
        ))}

            <tr>
            <button className="addNewPricePoint" onClick={() => handleAddNewPricePoint()} >Add New Price Point</button> 
                       
                      </tr>
      </tbody>
    </table>

   <div> {!editIsNewAsset?(<button className="new asset" onClick={() => handleClickSaveEditManualAsset()} >Save</button>):(<button className="new asset" onClick={() => handleClickCreateManualAsset()} >Create New Asset</button>)} <button className="new asset" onClick={() => handleCancelEditManualAsset(selectedAsset)} >Cancel</button></div>


     </div>    )}







{/* HERE WE MAKE THE ETORO VIEW MENU */}
     { selectedAsset && selectedAssetType==="eToro"  && editMode===false &&(
    <div className="assetdetails">  
     <p>{selectedAsset.Name}</p>
     <p>{selectedAsset.Type}</p>

     <table border="1">
      <thead>
        <tr>
        <th>Date</th>
          <th>NWA</th>
          <th>Type</th>
          <th>Units</th>
          <th>Amount</th>
          <th>Balance</th>
          <th>Details</th>
          <th>Asset type</th>
          <th>Position ID</th>
          <th>Realized Equity</th>
          <th>Realized Equity Change</th>
        </tr>
      </thead>
      <tbody>
        {selectedAsset.Data.map((item, index) => (
          <tr key={index}>
            <td>{item.Date}</td>
            <td>{item.NWA}</td>
            <td>{item.Type}</td>
            <td>{item.Units}</td>
            <td>{item.Amount}</td>
            <td>{item.Balance}</td>
            <td>{item.Details}</td>
            
            <td>{item["Asset type"]}</td>
            <td>{item["Position ID"]}</td>
            <td>{item["Realized Equity"]}</td>
            <td>{item["Realized Equity Change"]}</td>
          </tr>
        ))}
      </tbody> 
    </table>

   <div> <button className="new asset" onClick={() => handleEditManualAsset(selectedAsset)} >Edit</button> <button className="new asset" onClick={() => handleDeleteManualAsset(selectedAsset)}>Delete</button></div>


     </div>    )}






{/* HERE WE HAVE THE Etoro EDIT MENU */}
     { ((selectedAsset && selectedAssetType==="eToro")|| editIsNewAsset )  && editMode===true  &&(
    <div className="assetdetails"> 

     <table border="1">
      <thead>
        <tr>
        <th>Date</th>
          <th>NWA</th>
          <th>Type</th>
          <th>Units</th>
          <th>Amount</th>
          <th>Balance</th>
          <th>Details</th>
          <th>Asset type</th>
          <th>Position ID</th>
          <th>Realized Equity</th>
          <th>Realized Equity Change</th>
        </tr>
      </thead>
      <tbody>
        {editFormData.Data.map((item, index) => (
          <tr key={index}>
            <td><input value={editFormData.Data[index].Date}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index].Date} name="Date" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            {/* <td>{item.Date}</td> */}
            <td><input value={editFormData.Data[index].NWA}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index].NWA} name="NWA" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index].Type}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index].Type} name="Type" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index].Units}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index].Units} name="Units" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index].Amount}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index].Amount} name="Amount" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index].Balance}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index].Balance} name="Balance" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index].Details}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index].Details} name="Details" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index]["Asset type"]}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index]["Asset type"]} name="Asset type" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index]["Position ID"]}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index]["Position ID"]} name="Position ID" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index]["Realized Equity"]}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index]["Realized Equity"]} name="Realized Equity" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            <td><input value={editFormData.Data[index]["Realized Equity Change"]}type="text"  maxLength="10" required="required" placeholder={editFormData.Data[index]["Realized Equity Change"]} name="Realized Equity Chang" onChange={(event) => handleEditFormChangeEToro(event, index)}></input></td>
            
       
          </tr>
        ))}

            <tr>
            <button className="addNewPricePoint" onClick={() => handleAddNewTransaction()} >Add New Transaction</button> 
                       
                      </tr>
      </tbody>
    </table>

    <div> <p>Upload New Etoro Statement</p>
    <input type="file" onChange={(event)=>handleEtoroXLSX(event)}></input>
    
    </div>

   <div> {!editIsNewAsset?(<button className="new asset" onClick={() => handleClickSaveEditPublicAsset()} >Save</button>):(<button className="new asset" onClick={() => handleClickCreateManualAsset()} >Create New Asset</button>)} <button className="new asset" onClick={() => handleCancelEditManualAsset(selectedAsset)} >Cancel</button></div>


     </div>    )}














        </div></div>

    
                
         
       
    </div>
  );

 
};

export default Inputs;
