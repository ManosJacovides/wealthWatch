import React from "react";
import { useState } from "react";
import Header from "../components/header.jsx"; 
import Graph from "../components/Graph.jsx";
import SideBar from "../components/SideBar.jsx";
import emptyResults from '../results_full_empty.json';
import { useEffect } from "react";
import supabase from "../supabase.jsx";
import apiexample from '../apiresponsexample.json';
import EditTypesMenu from "../components/EditTypesMenu.jsx";






const Output = ({userCompleteResults,setUserCompleteResults, userData,setUserData, userID,upateUserCompleteResultsEmpty,fetchUserData}) => {

  //const userCompleteResultsEmpty = emptyResults;


 const userCompleteResultsEmpty = upateUserCompleteResultsEmpty(emptyResults);
 const [useCustomTypes, setUseCustomTypes] = useState(true);
 console.log(userCompleteResultsEmpty);







  const individualCompleteResultsArray=[]; //an array to temporary store all the individual complete results in one place before merging them 
  var aggregatedResult=userCompleteResultsEmpty;//emptyResults; // a variable to build the final userCompleteResult 



    //console.log("UserData received in output component", userData)

  //   if(userData)
  //   {
  //     const userCompleteResultsTemp=userData.find(item => item.id === userID).completeData;
  //   console.log("COMPELTTE RETRIEVED FROM BACKEND", userCompleteResultsTemp)
  //   setUserCompleteResults(userCompleteResultsTemp)
  // }

     // Create a function to make the API call for stock data
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


  async function convertEtoro(etoroImport){ //GOAL: WE CONVERT THE ETORO RAW DATA TO AN INDEPENTEND RESULTS_ETORO OBJECT // WE put async so it waits for the api response

    //const etoroResults=userCompleteResultsEmpty;// WE create our output results array with all dates prefilled
    
    const etoroResults = JSON.parse(JSON.stringify(userCompleteResultsEmpty)); // Create a deep copy of userCompleteResultsEmpty, if we simply do const etoroResults=userCompleteResultsEmpty; then we will change userCompleteResultsEmpty when we change etoroResults!
    //For object in etoro.json, 
                    //etoroImport.forEach(async (obj) => { // WE put async so it waits for the api response
    for (const obj of etoroImport) {
                            //console.log(obj);
    // Convert the date to the desired format "YYYY-MM-DD"
       const dateParts = obj.Date.split(' ')[0].split('/');
       const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    
        // Find the corresponding object in etoroResults
        const correspondingObject = etoroResults.find(item => item.DATE === formattedDate);
    
        // Log the corresponding object if found
        if (correspondingObject) {

              //First WE  SIMPLY ADD ALL THE CASH TO THE CORRESPONDING DATES AND BEYOND + calculate the initial missing asset and add it to all future dates (it's a constant since we don't know how it evolves)
              for (const entry of etoroResults) {     
                if (entry.DATE >= formattedDate) {
             //We create a cash entry
                  entry["Etoro Cash"]=obj["Balance"].toString();
    
                  //We create a Other Stocks entry to bridge the gap between total "Realized Equity"
                  if (!entry["Other Etoro Assets"]){ // WE SHOULD DO THE INITIALISATION ONLY IF IT IS EMPTY & does not exist; IF IT HAS ALREADY BEEN INITIALIZED AND ADAPTED, WE DONT WANT TO CHANGE IT TO THE INITIALIZED VALUE
                  entry["Other Etoro Assets"]=(etoroImport[0]["Realized Equity"]-etoroImport[0]["Balance"]).toString(); //The other assets can be approximated as = the unrealized equity - the cash 
                //THIS OTHER ETORO ASSETS ENTRY IS A CONSTANT THAT REPRESENTS ALL STOCKS NOT PRESENT IN THE PROVIDED BALANCE SHEET. IT CAN CHANGE ONLY WHEN WE CLOSE A POSITION THAT WAS NOT OPENED OFFICIALLY, SEE CLOSED POSITION CODE
                console.log("We reinitialise other assets from beginning")}
    
            }}


  
            
            
            //2)  SWITCH 
    
             switch (obj.Type) {
                case "Open Position":
                case "Position closed":// We trigger this for both OPEN and Close Positions
    
                    //console.log("Found an Open Position:");
                   // 1)We retrieve the ticker symbol from etoroImport object
                   const stockName = obj.Details.split('/')[0];
    
                   // 2) We retrieve the number of shares from etoroImport object
                   const numberOfShares=obj.Units;
                
                   // 3) We write the event in etoroResults object based on the info we retrieved at the right date (corresondingObject)
                   if (obj.Type=="Open Position") {correspondingObject.Events=+("Bought "+numberOfShares+" units of "+stockName);} // HERE WE ADD to the existing string (because there can be events from other stocks/assests coexisting, we don't want to overwrite)
                   if (obj.Type=="Position closed") {correspondingObject.Events=+("Sold "+numberOfShares+" units of "+stockName);}
                   //console.log(correspondingObject.Events);
    
                   // 4)We Do API call to get time series for stockName and retrieve the price for each date
                   let stockAPIData;

                  //  if (obj["Asset type"]=="Stocks"){ // We only make the STOCK api request if it is a stock. //UNCOMMENT IF WE REALLY WANT TO MAKE THE API CALL
                  //  stockAPIData= await fetchStockData(stockName); 
                  //  console.log("STOCK API DATA INSIDE OUR CONVERSION FUNCTION:",stockAPIData);

                  //  }

                   

                  //  if (obj["Asset type"]=="Crypto"){ // We make the crypto api request if it is a crypto.  //UNCOMMENT IF WE REALLY WANT TO MAKE THE API CALL, AND CREATE FTECGCRPYTO DATA FUNCTION TO MAKE API CALL
    
                  //   stockAPIData= await fetchStockData(stockName);
  
                  //    }
                 stockAPIData=apiexample; // COMMENT IF WE WANT TO MAKE TESTS WITHOUT USING API LIMIT, using our json example
    
                   
                // 5 )for all datesF AFTER (and including) DATE  in etoroResults:  
    
                var stockPrice =0;
                        for (const entry of etoroResults) {
                            
                            if (entry.DATE >= formattedDate) {
                                  // 1) We calculate the value of the stock: const stockValue= PRICE*numberOfShares , PRICE taken from API data
    
                                  if  (stockAPIData && stockAPIData[entry.DATE]) { // BECAUSE SOME DATES THERE IS NO DATA AVAILABLE (WEEKENDS ETC) OR THE date is too early and tehre is not data, in that case we get 0 BECAUSE THE LOOP STARTS AT EARLIER DATES
                                 stockPrice = stockAPIData[entry.DATE]["1. open"];
                                  //const stockPrice=stockAPIData.formattedDate[0];
                                  //console.log(`WE RETRIEVE THE PRICE FOR DATE ${entry.DATE } which is ${stockPrice}`);
                                }
    
                                  else {
                                    //console.log(`No data available so WE Use the Previous day which is ${stockPrice}`);
                                }
                                 
    
                                  const stockValue=(numberOfShares*stockPrice).toString();
                                
                                        // 2) We populate the etororesult object with the stock and its price at each date:
                                        //      IF "StockName"DOES NOT ALREADY EXIST in datesF object: add element '"stockName":"stockValue"           
                                       //      IF "StockName" EXISTS in datesF object: '"stockName" value = '"stockName" value + stockValue
    
                                                // Check if the property "X" exists in the entry object
                                                if (stockName in entry) {
                                                    // If the property exists, add  to its value
                                                    
                                                    if (obj.Type=="Open Position") {
                                                        
                                                        const currentValue=parseFloat(entry[stockName ]); // WE CONVERT TO FLOAT SO WE CAN DO THE OPERATION
                                                        const valueToAdd=parseFloat(stockValue); // WE CONVERT TO FLOAT SO WE CAN DO THE OPERATION
                                                        const newValue=currentValue+valueToAdd;
    
                                                        entry[stockName ] =newValue.toString(); // we reassign to the entry the new value converted to Float
                                                        //entry[stockName ] +=stockValue ;
                                                    
                                                    // WE CONVERT TO STRING BECAUSE THATS HOW THE GRAPH READS IT
                                                    entry[stockName] = entry[stockName].toString();
                                                    //console.log(entry);
                                                    } // TO DO: ADAPT SO IT CAN REALLY ADD: CONVERT TO FLOAT THEN TO STRING AGAIN
                                                    if (obj.Type=="Position closed"){entry[stockName ] -=stockValue // HERE WE DONT NEED TO CONVERT, BECAUSE JS AUTOMATICALLY DOES THE OPERATIONS WITH "MINUS" OPERATOR
                                                        // WE CONVERT TO STRING BECAUSE THATS HOW THE GRAPH READS IT
                                                    entry[stockName] = entry[stockName].toString();
    
                                                        //IF WE HAVE NO STOCK LEFT (So the difference is almost 0, we have less than 10USD); WE CAN REMOVE THAT STOCK FROM OUR RESULTS AND OUR GRAPHS
                                                        if (entry[stockName ]<5 && entry[stockName ] >-5 ){
                                                          console.log(entry)
                                                          console.log("We sold an asset completely")
    
                                                            delete entry[stockName];
                                                            
                                                        }
                                                        //if we sell more than what we thought we have, we can remove that stock AND REMOVE THE VALUE FROM "OTHER ASSETS"
                                                        if (entry[stockName]<-5){


                                                          console.log("We sold more than what we thought we have to we remove the difference from Etoro Other Assets",entry[stockName],entry["Other Etoro Assets"],parseFloat(entry[stockName])+parseFloat(entry["Other Etoro Assets"]))

                                                        const updatedOther=parseFloat(entry[stockName])+parseFloat(entry["Other Etoro Assets"]);
                                                         entry["Other Etoro Assets"]=updatedOther.toString();
                                                         

    
                                                          delete entry[stockName];
                                                          
                                                      }
                                                        
                                                        ;} 
                                                    
                                                } else {
                                                    if (obj.Type=="Open Position") {// For open positions, If the property doesn't exist, create it and assign the value Y
                                                    entry[stockName] = stockValue;
                                                    //console.log(entry);
                                                   // WE CONVERT TO STRING BECAUSE THATS HOW THE GRAPH READS IT
                                                   entry[stockName] = entry[stockName].toString();

                                                  
                                                  
                                                  // //TO MAKE SURE OTHER ASSETS IS BALANCED, WE REMOVE THE UNREALIZED PRICE OF ASSET BOUGHT FROM THE UNREALIZED EQUITIY IN ORDER TO HAVE UPDATED OTHER ASSETS
                                                  //  const unrealizedStockValue=stockAPIData[formattedDate]["1. open"]*numberOfShares; // WE TAKE THE PRICE WHEN THE ASSET WAS BOUGHT TO HAVE UNREALIZED VALUE
                                                  //  entry["Other Etoro Assets"]-=unrealizedStockValue.toString(); //We remove from all entities after the byuying date the value bought
                                                  // // WE DONT NEED TO DO ANTYHING ON THIS FRONT WHEN WE SELL, BECAUSE IT WILL TRANSFORM TO CASH AND CASH IS ALREADY TAKEN INTO ACCOUNT IN OTHER ASSET CALCULATIONS
                                                  
                                                  }
    
                                                   // For closed positions, if the property does not exists, we remove it from the OTHER ASSET PROPERTY (and the cash is automatically going to cash property form cash operation)
                                                   if (obj.Type=="Position closed") {
                                                   entry["Other Etoro Assets"]=(entry["Other Etoro Assets"]-stockValue).toString();
                                                         console.log("We sold an asset we did not know we have so we have to remove value from Etoro Other Assets", entry["Other Etoro Assets"], stockValue.toString(), entry)
                                                         entry["Other Etoro Assets"]=entry["Other Etoro Assets"].toString();
                                                        
                                                        }
    
                                                
    
                                                   
                                                }
                                    
                                            }
    
                                    //NEXT STEPS: 
                                  //  1) DONE -  TEST IF THE etoroResults object can be rendered in the graph component to see if and how it works. DO MANY TESTS; CHECK THAT BTC API WORKS (strange values), etc...
                                    // 2) DONE - DO SAME as OPEN POSITION WITH POSITION CLOSED (PUT IN SAME SWITCH AND AD IFs ?) AND SEE WHAT HAPPENS WHEN THE WHOLE POSITION IS CLOSED?
                                    //LATER
                                    // 3) DO DIVIDEND: WRITE THE TOTAL DIVIDEND SOMEWHERE IN A DIVIDEDN TABLE 
                                    // 4) DO GRAPH OBJECT ADAPTATIONS (in graph component), ETC
                  
                                
                            }
    
                                      
                  break;
                // case "Position closed":
                //   // Handle case for "Position closed"
                //   console.log("Position closed");
                //   break;
                case "Dividend":
                  // Handle case for "Dividend"
                  console.log("Dividend");
                  break;
                default:
                  // Handle default case (if "Type" doesn't match any of the cases)
                  console.log("Other type");
                  break;
              }
          


                    //        
                    
    
                                   
    
                     //                 FOR CLOSED POSITION / OPEN ADD CASH CONSIDERATION?
                                       
                                          //   4)  IF "ETORO CASH" EXISTS in datesF object: '"ETORO CASH" value = "BALANCE" value taken directly from the etoro.json object
                                          //       IF "ETORO CASH" DOES NOT EXISTS, add element "ETORO CASH" in datesF object, with value:  "BALANCE" value taken directly from the etoro.json object
                
                                          //IF DIVIDEND: ......
                                         //IF INTEREST, WITDRAW, DEPOSIT, ADJUSTMENT: ......add comment + update Balance
    
    
                                          // SEE HOW WE COULD ALSO CREATE A: UNKOWN ETORO element which is the difference between all ETORO values (Balance and stocks considered) and "Realized Equity" data from et
    
    
    
                                        //   console.log("ETORO RESUTLTS",etoroResults);
                                        //   console.log("USER COMPLETE RESULTS:", userCompleteResults);
                                          
    
    
    
    
        } else { //IF the Date was not found in etoro empty template
            console.log(`No corresponding object found for date ${formattedDate}`);
        }
        console.log("ETORO RESULTS", etoroResults);
        //setUserCompleteResults(etoroResults);

       //We then push etoro converted results into out individualCompelte results Array
        individualCompleteResultsArray.push(etoroResults);
    
    


        // const mergedResults= mergeResults(userCompleteResults,etoroResults); // This adds all etoro considerations in a usercompleteResults clone.
        // setUserCompleteResults(mergedResults); // We then assign this clone to userCompleteResults Variable
    
    
        // //setUserCompleteResults([...etoroResults])
     
        // //console.log("we setUserCOmpelteResults")
        // //setUserCompleteResults(jsonData);
    
        // // WE THEN SEND THE COMPLETE UPDATED RESULT TO THE BACKEND
        // console.log("MERGED RESULTS AFTER RUNUNG ETORO:",userCompleteResults);//userCompleteResults
        // updateBackendUserCompleteResults(mergedResults,userID);
    
       
    }; //)
                   
    
    }
    
    
   function convertManualAsset(manualAsset){

      console.log("USERCOMPELTE RESULTS BEFORE CONVERSION",userCompleteResults)
        
        
    
        //const manualResults=userCompleteResultsEmpty;// WE create our output results array with all dates prefilled
        //console.log("MANUALRESULTS CLASSIQUE", manualResults)
        const manualResults = JSON.parse(JSON.stringify(userCompleteResultsEmpty)); // Create a deep copy of userCompleteResultsEmpty, if we simply do const etoroResults=userCompleteResultsEmpty; then we will change userCompleteResultsEmpty when we change etoroResults!
        console.log("MANUALRESULTS JSONPART DEEP",JSON.parse(JSON.stringify(userCompleteResultsEmpty)));
        for (const obj of manualAsset.PriceHistory) {
            console.log(obj)
            const correspondingObject = manualResults.find(item => item.DATE === obj.Date);
    
            if (correspondingObject) {
            console.log("Found Corresponding object",correspondingObject )
    
                for (const entry of manualResults) {
                                
                    if (entry.DATE >= obj.Date) {
                        entry[manualAsset.Name ] =obj.Valuation;
                        
                    }
                }
    
            }
        }
        //console.log("USERCOMPELTE RESULTS BEFORE MERGING FUNCTION",userCompleteResults)
       // console.log("MANUAL RESULTS BEFORE MERGING FUNCTION",manualResults)
       
       //const mergedResultsManual= mergeResults(JSON.parse(JSON.stringify(userCompleteResults)),JSON.parse(JSON.stringify(manualResults))); // This adds the manual consideration in a usercompleteResults clone.
       // const mergedResultsManual = mergeResults(JSON.parse(JSON.stringify(userCompleteResults)), JSON.parse(JSON.stringify(manualResults)));

      //   console.log("MANUAL RESULTS AFTER MERGING FUNCTION",mergedResultsManual)
      //   console.log("USECOMPLETERESULTS AFTER MERGING FUNCTION BUT BEFORE ASSING IT TO MERGEDRESULTS",mergedResultsManual)
      //  setUserCompleteResults(JSON.parse(JSON.stringify(mergedResultsManual))); //mergedResultsManual// We then assign this clone to userCompleteResults Variable
      //   console.log("USECOMPLETERESULTS AFTER MERGING FUNCTION AND AFTER ASSING IT TO MERGEDRESULTS",mergedResultsManual)
       
      //  // WE THEN SEND THE COMPLETE UPDATED RESULT TO THE BACKEND
      //   updateBackendUserCompleteResults(mergedResultsManual,userID);//userCompleteResults 
    
    //We add the complete results in the individual complete result array to store them before merging them
    individualCompleteResultsArray.push(manualResults);
    //console.log("individual results array",individualCompleteResultsArray)
    
    }
    
    
    function mergeResults(data1, data2){// We merge the smallData results (i.e etoro or manually added stuff) to the userCompleteResults Result Object, also we here we need to do an API call to update the user DB in backend
           
            // For each date of the small data, add smallData assets TO UserCompleteResults at that date object (Ex: Stock J from etoro added to the list of stocks for date X)
    
        
                // Create a dictionary for quick lookup of data2 by DATE
                const data2Dict = {};
                data2.forEach(item => {
                    data2Dict[item.DATE] = item;
                });
            
                // Iterate through data1 and merge corresponding objects from data2
                const mergedData = data1.map(item => {
                    const data2Item = data2Dict[item.DATE];
                    if (data2Item) {
                        return { ...item, ...data2Item };
                    }
                    return item;
                });
            
                return mergedData;
            
           
        }

        async function updateBackendUserCompleteResults(userCompleteResults, userID) {
          try {
            const { data, error } = await supabase
              .from('users')
              .update({ completeData: userCompleteResults })
              .eq('id', userID);
        
            if (error) throw error;
            if (data) console.log(data);
          } catch (error) {
            console.log(error);
          }
        }


        const fetchSingleUserData = async(userID) => { // FIRST WE GET THE DATA FROM THE BACKEND
          const {data, error}=await supabase
          .from('users')
          .select()
          .eq('id', userID);
          if(error){
          console.log("HERE IS THE ERROR", error);
          setUserData(null);}
          if(data){
          
              setUserData(data); //since our object is inside a larger object (and is the only object there), we extract it with [0]
             
          }}
      

          
        async function loadAndConvertData(){


          try {

            //0) We initialise userCompleteResults with an empty array (LATER WE SHOULD ADD THE MISSING DAYS TO TODAY HERE)
            setUserCompleteResults(userCompleteResultsEmpty); //emptyResults
            aggregatedResult=userCompleteResultsEmpty;
      

            //1) We load user info from backend, this updates userData with the datafrom the user we want
            await fetchSingleUserData(userID);

            //2) We treat the Manual Assets first, for each manual asset, we convert it to completeResults format and we simply fill in an array with all the individual converted results first
            console.log("User Data Manual Data is:",userData[0].manualData)
            userData[0].manualData.forEach(object => {
              console.log("Object we run convertManual on", object);
             convertManualAsset(object); 

          });

          //3) We then treat automated Data, first Etoro for ex:
          //await convertEtoro(userData[0].etoroData);
          //console.log("await convertEtoro(userData[0].etoroData);",userData[0].etoroData )

          //We retrieve Etoro Data from Backen, in column Public Data Json, the object that has the name Etoro has the data we need.
          await convertEtoro(userData[0].publicData.find(data => data.Name === "eToro").Data);
          //console.log("userData[0].publicData.find(data => data.Name === eToro",userData[0].publicData.find(data => data.Name === "eToro"))


          //4)Then we treat other brokers such as degiro, or manually uploaded stocks




          //-1) We then merge all the individual results, before assinging them to userCompleteResults

          individualCompleteResultsArray.forEach(result=>{
            aggregatedResult=mergeResults(result,aggregatedResult);
            //console.log("AGGREGATEDRESULT", aggregatedResult)
            
          })
          setUserCompleteResults(JSON.parse(JSON.stringify(aggregatedResult)));
            
    
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }


  
    

 

  return (
    <div className="Output">


<Header/>
        <div className="container">
            <SideBar/>

            <div className="content"> 

            <Graph userCompleteResults={userCompleteResults} loadAndConvertData={loadAndConvertData} userData={userData} userID={userID} useCustomTypes={useCustomTypes} setUseCustomTypes={setUseCustomTypes}/>

            
            <EditTypesMenu userData={userData} userID={userID} useCustomTypes={useCustomTypes} setUseCustomTypes={setUseCustomTypes}  />
            
            
            </div>

            
            
            <button onClick={() => loadAndConvertData()}>Load Data</button>
           
      </div>


      
      

  
    
     
    </div>
  );

 
 };

export default Output;
