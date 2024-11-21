import React from "react";
import './Flights.style.css';

function Flights({ data, city }) {


    return (
        <div className="flight-container">
            <h5>{`Istanbul - ${city}`}</h5>
        </div>
    )
}

export default Flights;