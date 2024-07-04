import React, { useImperativeHandle } from "react";
import { Link, useMatch, useResolvedPath} from "react-router-dom";

function SideBar() {



  return (
    <div className="SideBar">
      
      <ul className="verticalnavUL"> 

      
    
     <div className="sidebarButtons" id={window.location.pathname=="/inputs"? "active": ""} onClick={()=>{window.location.pathname="/inputs"}}>INPUT </div> 
     <div className="sidebarButtons" id={window.location.pathname=="/output"? "active": ""} onClick={()=>{window.location.pathname="/output"}}>MY GRAPH  </div>
     <div className="sidebarButtons" id={window.location.pathname=="/simulations"? "active": ""} onClick={()=>{window.location.pathname="/simulations"}}> Simulations  </div> 
   
   
  
     
      </ul>
    </div>
  );
}

export default SideBar;
