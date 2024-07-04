import React from "react";
import jsonData from '../etoro.json';
const Table = () => { // Step 2
    // Step 3: Import JSON Data
    //const jsonData = require('../etoro.json'); 
  
    return (
        <div>
          <h2>My Table</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
                <th>Amount</th>
                <th>Units</th>
                <th>Realized Equity Change</th>
                <th>Realized Equity</th>
                <th>Balance</th>
                <th>Position ID</th>
                <th>Asset type</th>
                <th>NWA</th>
              </tr>
            </thead>
            <tbody>
              {jsonData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Date}</td>
                  <td>{item.Type}</td>
                  <td>{item.Details}</td>
                  <td>{item.Amount}</td>
                  <td>{item.Units}</td>
                  <td>{item['Realized Equity Change']}</td>
                  <td>{item['Realized Equity']}</td>
                  <td>{item.Balance}</td>
                  <td>{item['Position ID']}</td>
                  <td>{item['Asset type']}</td>
                  <td>{item.NWA}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };
  
  export default Table;