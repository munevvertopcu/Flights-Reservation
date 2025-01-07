import React from "react";
import './Reservation.style.css';
import { hoursDifference } from "../../helpers";

function Reservation({ data }) {

    const options = { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" };
    const formatter = new Intl.DateTimeFormat("en-GB", options);

    return (
        <div className="reservation-card">
            <p id="time">{data.departureTime} - {data.arrivalTime}</p>
            <div className="flight-detail">
                <div className="info">
                    <h5>{data.departureAirport} to {data.arrivalAirport}</h5>
                    <p id="text">{data.flightName}</p>
                </div>
                <div className="info">
                    <h5>Nonstop</h5>
                    <p id="text">{hoursDifference(data.departureTime, data.arrivalTime)}</p>
                </div>
                <div className="info">
                    <h5>{formatter.format(new Date(data.scheduleDateTime))}</h5>
                    <p id="text"> 8 kg cabin luggage</p>
                </div>
                <div className="info">
                    <h5>${data.price}</h5>
                    <p id="text">Economy</p>
                </div>
            </div>
        </div>
    )
}

export default Reservation;