import React from "react";
import './Flights.style.css';

export default function FlightDetail({ header, time, airport, iconName }) {

    return (
        <div>
            <div className="icon-and-header">
                <img src={iconName} />
                <p className="flight-header">{header}</p>
            </div>
            <h5>{time}</h5>
            <p style={{ fontSize: 10 }}>Airport: {airport}</p>
        </div>
    );
}
