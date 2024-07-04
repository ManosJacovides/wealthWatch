import React from "react";

function ReadOnlyRow({PriceHistory}) {

  return (
    <tr> 
    <td> {PriceHistory.type}</td>
    <td> {contact.input}</td>
    <td> {contact.inputvalue}</td>
    <td> {contact.inputvalueunit}</td>
    <td> {contact.impactfactor} </td>
    <td> {contact.eFUnit} </td>
    <td> {typeof contact.eFGHG === 'number' ? contact.eFGHG.toPrecision(3) : contact.eFGHG}  </td> {/*}This way we round it up to 3 digits, sometimes the toPrecision conversion is not direct and it brings a bug so we make it conditional*/}
    <td className="comments-column">
  {contact.comments ? ( //Only do the conversion work if contact.comments in not null, otherwise we get an error
    <span dangerouslySetInnerHTML={{ __html: contact.comments.replace(/\n/g, '<br>') }} />
  ) : null}
</td> {/*}This is to allow paragraphing, so that the text appears with the paragraphs*/}
    <td><button type="button" onClick={(event)=> handleEditClick(event,contact)}>Edit</button> <button type="button" className="delete" onClick={(event)=> handleDelete(contact.id)}>Delete</button></td>
</tr>
  );
}

export default ReadOnlyRow;
