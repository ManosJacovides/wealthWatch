import React from "react";

function Footer(){
    const d = new Date();
    let year = d.getFullYear();

    return(
        <footer> <p> © Wealth Glimpse {year} </p>
    </footer>);
}

export default Footer;