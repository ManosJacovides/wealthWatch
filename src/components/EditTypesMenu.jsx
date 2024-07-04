import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale, TimeSeriesScale } from 'chart.js';
import { Switch } from 'antd';
import supabase from "../supabase.jsx";



const EditTypesMenu = ({ userData, userID,useCustomTypes,setUseCustomTypes }) => {
  const [myAssetTypesGrouped, setMyAssetTypeGrouped] = useState({});
  const [draggedAsset, setDraggedAsset] = useState(null);
  const [addNewType, setAddNewType] = useState(false);
  
  const [newTypeName, setNewTypeName] = useState("");




 


  async function updateBackendUserAssetTypes(AssetTypes, userID) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({AssetTypes: AssetTypes })
        .eq('id', userID);
  
      if (error) throw error;
      if (data) console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

    
    async function updateBackendUserAssetTypes_Default(AssetTypes_Default, userID) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({AssetTypes_Default: AssetTypes_Default })
          .eq('id', userID);
    
        if (error) throw error;
        if (data) console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

  function updateGroupedData(AssetTypes){
    
        const groupedData = AssetTypes.reduce((acc, item) => { //WE REORGANISE ASSETTYPES OBJECT TO RENDER IT EASIER
          const type = item.Type;
          const asset = item.Asset;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(asset);
          return acc;
        }, {});
        setMyAssetTypeGrouped(groupedData);
      
    
  }

  useEffect(() => { // WE render the Default or the custom based on the state of the variable useCustomTypes, which rerenders the menu each time this variable changes

    if (userData) {
      const user = userData.find(item => item.id === userID);
      if (user && user.AssetTypes && useCustomTypes) {

    updateGroupedData(user.AssetTypes);}
    else if (user && user.AssetTypes && !useCustomTypes) {


      updateGroupedData(user.AssetTypes_Default)
      console.log("DEFAULT TPYES",user.AssetTypes_Default )
      
      
      ;}








      //at each render, we make sure that all assets are present in our custom assetTypes array

      var newArray = user.AssetTypes;
      const uniqueAssets = new Set();
      const uniqueAssetsFromData= new Set(); // We also create this in order to compare it with uniqueAssets to see if there are some assets that have to be deleted because no longer there in the data

        //FIrst we populate our uniqueAsset set with all assets we already have in our AssetType Array
      user.AssetTypes.forEach(item => {
        const assetName = item["Asset"];
        if (!uniqueAssets.has(assetName)) {
          uniqueAssets.add(assetName);
        }
      })
      

      //1) We scan through Manual Data
  user.manualData.forEach(item => {
    const assetName = item.Name;
    const assetType = item.Type;

    if (!uniqueAssets.has(assetName)) {
      uniqueAssets.add(assetName);
      newArray.push({
        Type: assetType,
        Asset: assetName
      });
     
    }

    uniqueAssetsFromData.add(assetName);
    

  })

    //2) We scan through Etoro data
    console.log("ETORO DATA",user.publicData.find(item => item["Name"] === "eToro").Data)
    user.publicData.find(item => item["Name"] === "eToro").Data.forEach(item => {

      let assetName;
      if (item["Details"]){
      console.log("DETAILS IS",item["Details"])
     assetName = item["Details"].split('/')[0];}
      
      const assetType = item["Asset type"];
  
      if (!uniqueAssets.has(assetName) && assetType && assetName) {
        uniqueAssets.add(assetName);
        newArray.push({
          Type: assetType,
          Asset: assetName
        });}


        if (assetType && assetName) {
          uniqueAssetsFromData.add(assetName);}
      

    });

    

    console.log("Unique Assets", uniqueAssets,"Unique Assets FROM DATA", uniqueAssetsFromData)

    //We compare the 2 sets in order to remove any element that is in uniqueAssets and that is not in uniqueAssetsFromData
    for (let item of  uniqueAssets) {
      if (! uniqueAssetsFromData.has(item)) {
        //If there is such element, we need to remove it from the newArray
        console.log("FOUND EXTRA ELEMENT",newArray)

        newArray=newArray.filter(item1 => item1.Asset !== item);
        
      }}


      console.log("NEW ARRAY FINAL",newArray)
    updateBackendUserAssetTypes(newArray,userID);
    updateGroupedData(newArray);












      


   
  }}, [userData, userID,useCustomTypes]); 

  


  function handleOnDrag(e,asset){
    console.log("We grabbed", asset)
    setDraggedAsset(asset)
  }

  function handleOnDrop(e,category){
    console.log("We dropped ", draggedAsset," in ", category)
  

    const assetTypes = userData.find(item => item.id === userID).AssetTypes
   // Create a copy of the original data array
  const newAssetTypes = assetTypes.map(item => {
    // If the asset matches, update the type
    if (item.Asset === draggedAsset) {
      return { ...item, Type: category };
    }
    // Otherwise, return the original item
    return item;
  });


  console.log("New AssetTypes", newAssetTypes);

  //WE CAN THEN UDPATE BACKEND
  updateBackendUserAssetTypes(newAssetTypes, userID);
  
  //And update our View by updating state var groupedData
  updateGroupedData(newAssetTypes)


  window.location.reload()

  }

  

  function handleEditNewType(e){
    const typeName=e.target.value;

    console.log(typeName);

   setNewTypeName(typeName);
  }

  function handleAddNewType() {

    console.log(myAssetTypesGrouped);

    const newGroupedAssetTypes=myAssetTypesGrouped;

    newGroupedAssetTypes[newTypeName]=[];

    setMyAssetTypeGrouped(newGroupedAssetTypes);
    console.log("ASSET TYPE AFTER ADDING NEW TYPE", newGroupedAssetTypes);

    setAddNewType(false); 
  
    
  }


  function handleOnDragOver(e,category){
    e.preventDefault();
   // console.log("We are dragging over", category)
  }

  function handleSwitchCustomTypes(checked){
      //const customTypesTemp=!useCustomTypes;
      setUseCustomTypes(!checked);
      createDefaultTypes()

  }

  function createDefaultTypes(){

    if (userData) {


      const user = userData.find(item => item.id === userID);
      const uniqueAssets = new Set();
      const newArray = [];

      //1) We scan through Manual Data
  user.manualData.forEach(item => {
    const assetName = item.Name;
    const assetType = item.Type;

    if (!uniqueAssets.has(assetName)) {
      uniqueAssets.add(assetName);
      newArray.push({
        Type: assetType,
        Asset: assetName
      });
    }
  })

    //2) We scan through Etoro data
    console.log("ETORO DATA",user.publicData.find(item => item["Name"] === "eToro").Data)
    user.publicData.find(item => item["Name"] === "eToro").Data.forEach(item => {

      let assetName;
      if (item["Details"]){
      console.log("DETAILS IS",item["Details"])
     assetName = item["Details"].split('/')[0];}
      
      const assetType = item["Asset type"];
  
      if (!uniqueAssets.has(assetName) && assetType && assetName) {
        uniqueAssets.add(assetName);
        newArray.push({
          Type: assetType,
          Asset: assetName
        });
      }
    });

    console.log("RETRIEVED default TYPES", newArray)
    updateBackendUserAssetTypes_Default(newArray,userID);

  }

}


  return (
    <div>
      {Object.keys(myAssetTypesGrouped).length > 0 && (
        <div className="MainGraph">
          {Object.keys(myAssetTypesGrouped).map(category => (
            <div key={category} className="category-box">
              {useCustomTypes?
              <div onDrop={(e)=>handleOnDrop(e,category)} onDragOver={(e)=>handleOnDragOver(e,category)}><h3>{category}</h3>
              <ul>
                {myAssetTypesGrouped[category].map((item, index) => (
                  <div key={index} draggable onDragStart={(e)=>handleOnDrag(e,item)}><li  key={index}>{item}</li></div>
                ))}
              </ul></div>
              :
              <div><h3>{category}</h3>
              <ul>
                {myAssetTypesGrouped[category].map((item, index) => (
                  <div key={index}><li  key={index}>{item}</li></div>
                ))}
              </ul></div>}
            </div>
          ))}
         {useCustomTypes && <div>{(!addNewType)?(<button onClick={()=>{setAddNewType(true)}}>Add new Type</button>):(<div><input value={newTypeName}type="text"  maxLength="45" required="required" placeholder="New Type Name" name="Name" onChange={(event) => handleEditNewType(event)}/> <button onClick={handleAddNewType}>Save</button></div>)}</div>}
          
          <Switch onChange={(checked)=>{handleSwitchCustomTypes(checked)}
            }/> <p>{!useCustomTypes?"Use Custom Types":"Use Default Types (defined in Input Menu)" }</p>
        </div>
      )}
    </div>
  );
};

export default EditTypesMenu;
