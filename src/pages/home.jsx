import React from "react";
import { useState } from "react";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import SideBar from "../components/SideBar.jsx";
import supabase from "../supabase.jsx";





const Home = () => {

  console.log(supabase);

 

  return (
    <div className="Inputs">
      <Header/>
      <SideBar/>
      <h1>WELCOME</h1>
    </div>
  );

 
};

export default Home;
