import React, { useState, Fragment, useEffect } from "react";
import { Link } from 'react-router-dom';

function AddInputRow({ handleAddFormChange, handleAddFormSubmit}) {


  return (
    <tr>
    <td> <select id="type" name="type" onChange={handleAddFormChange}>
      <option value="">Select...</option>
      <option   value="My Product">My Product</option>
      <option  value="Reference">Reference</option>

    </select></td>
   
        <td><input
        
       //value={addFormData.input}
        type="text"
        maxLength="45"
        name="input"
        required="required"
        placeholder="Material or Process"
        onChange={handleAddFormChange}
        /></td>
          <td><input
        type="number"
      
        name="inputvalue"
        required="required"
        placeholder="10"
        onChange={handleAddFormChange}
        /></td>
         <td><input
        type="text"
        maxLength="45"
        name="inputvalueunit"
        required="required"
        placeholder="kg"
        onChange={handleAddFormChange}
        /></td>
        {/*<td><input
        type="text"
        name="impactfactor"
        required="required"
        placeholder="Select Emission Factor"
        onChange={handleAddFormChange}
  /></td>*/}


         

<td colSpan="3"> {/*<Link to="/lcapage/impactfactors"> <button className="efbutton" type="submit" onClick={handleSelectEFClick}>{selectedEF.phase===phase?(selectedEF.name):"Select Impact Factor"}</button></Link></td> */}
<button className="efbutton" type="submit" > </button></td>


<td><textarea className="comments-column"
        //type="textarea"
        style={{ width: '100%'}}
       
        maxLength="500"
        name="comments"
        required="required"
        placeholder="add comments, calculation details or sources here"
        onChange={handleAddFormChange}
        /></td>
    


        <td><button type="submit" onClick={handleAddFormSubmit}>Add</button></td>
        </tr>
  );
}

export default AddInputRow;
