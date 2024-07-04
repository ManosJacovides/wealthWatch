import React from "react";
import { useState } from "react";
import Header from "../components/header.jsx"; 
import Graph from "../components/Graph.jsx";
import SideBar from "../components/SideBar.jsx";





const Simulations = ({userCompleteResults}) => {

 

 

  return (
    <div >


<Header/>
        <div className="container">
            <SideBar/>

            <div className="content"> <Graph userCompleteResults={userCompleteResults}/> <p>Add Goal Setting, GPT assistant to give advice on strategy to meet goals, Add Scenario definition Menu: table with all Asset Categories and how they would evolve</p></div>
      </div>


      
           

  
    
     
    </div>
  );

 
};

export default Simulations;
