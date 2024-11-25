import React from "react";
import './Flights.style.css';

function Flights({ data, city }) {

    return (
        <div className="flight-container">
            <h5>{data.flightDirection === "D" ? `Amsterdam - ${city}` : `${city} - Amsterdam `}</h5>
        </div>
    )
}

export default Flights;