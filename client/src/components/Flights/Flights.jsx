import React from "react";
import './Flights.style.css';
import flight_takeoff from '../../assets/flight_takeoff.svg';
import flight_landing from '../../assets/flight_landing.svg';
import plane from '../../assets/plane.svg';
import { getTime, hoursDifference, getRandomPrice } from "../../helpers";
import { Post } from "../../controllers/httpControllers";

function Flights({ data, city }) {

    return (
        <div className="flight-container">
            <h5 id="h5">{data.flightDirection === "D" ? `Amsterdam - ${city}` : `${city} - Amsterdam `}</h5>
            <div className="time-container">
                <div>
                    <div className="icon-and-header">
                        <img src={flight_takeoff} />
                        <p className="flight-header">Departure</p>
                    </div>
                    <h5>{data.flightDirection === "D" ? data.scheduleTime.slice(0, -3) : getTime(data.scheduleTime.slice(0, -3), -2, -30)}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {data.flightDirection === "D" ? "AMS" : data.route.destinations[0]}</p>
                </div>
                <div className="line">------</div>
                <div className="line">
                    <img src={plane} height={15} />
                    <p style={{ fontSize: 10 }}>
                        {data.flightDirection === "D"
                            ?
                            hoursDifference(data.scheduleTime.slice(0, -3), getTime(data.scheduleTime.slice(0, -3), 6, 20))
                            :
                            hoursDifference(getTime(data.scheduleTime.slice(0, -3), -2, -30), data.scheduleTime.slice(0, -3))} (Nonstop)
                    </p>
                </div>
                <div className="line">------</div>
                <div>
                    <div className="icon-and-header">
                        <img src={flight_landing} />
                        <p className="flight-header">Arrival</p>
                    </div>
                    <h5>{data.flightDirection === "A" ? data.scheduleTime.slice(0, -3) : getTime(data.scheduleTime.slice(0, -3), 6, 20)}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {data.flightDirection === "A" ? "AMS" : data.route.destinations[0]}</p>
                </div>
            </div>
            <div className="price-wrapper">
                <div>
                    <h5 style={{ color: "#4c2897" }}>Price: ${getRandomPrice()}</h5>
                    <p id="p">One Way</p>
                </div>
                <button className="book-flight-button" onClick={() => Post("/save", { scheduleTime: data.scheduleTime, flightDirection: data.flightDirection, route: data.route.destinations[0], scheduleDate: data.scheduleDate })}>
                    Book Flight
                </button>
            </div>
        </div>
    )
}

export default Flights;