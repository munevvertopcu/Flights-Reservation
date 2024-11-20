import React from "react";
import './Flights.style.css';

function Flights({ data, city }) {


    return (
        <div className="flight-container">
            <h3>{`Istanbul - ${city}`}</h3>
        </div>
    )
}

export default Flights;