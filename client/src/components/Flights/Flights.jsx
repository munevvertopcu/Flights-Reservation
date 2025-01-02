import React from "react";
import './Flights.style.css';
import flight_takeoff from '../../assets/flight_takeoff.svg';
import flight_landing from '../../assets/flight_landing.svg';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plane from '../../assets/plane.svg';
import { hoursDifference, getRandomPrice, addTimeAndFormat } from "../../helpers";
import { Post } from "../../controllers/httpControllers";

function Flights({ data, city }) {

   function handleBookFlight() {
        
        function calculateFlightDate(scheduleDateTime, direction) {
            if (direction === "D") {
                return new Date(scheduleDateTime);
            } else {
                const adjustedDate = addTimeAndFormat(scheduleDateTime, -2, -30).date;
                return new Date(adjustedDate);
            }
        }
        
        const currentDate = new Date();
        const flightDate = calculateFlightDate(data.scheduleDateTime, data.flightDirection);

        if (flightDate.getTime() < currentDate.getTime()) {
            return toast.error("You can't buy past-dated tickets");
        }
           Post("/save", { scheduleTime: data.scheduleTime, flightDirection: data.flightDirection, route: data.route.destinations[0], scheduleDate: data.scheduleDate })
           .then(() => toast.info("Your flight has been saved"))
         
    }

    return (
        <div className="flight-container">
            <h5 id="h5">{data.flightDirection === "D" ? `Amsterdam - ${city}` : `${city} - Amsterdam `}</h5>
            <div className="time-container">
                <div>
                    <div className="icon-and-header">
                        <img src={flight_takeoff} />
                        <p className="flight-header">Departure</p>
                    </div>
                    <h5>{data.flightDirection === "D" ? data.scheduleTime.slice(0, -3) : addTimeAndFormat(data.scheduleDateTime, -2, -30).amsterdamTime}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {data.flightDirection === "D" ? "AMS" : data.route.destinations[0]}</p>
                </div>
                <div className="line">------</div>
                <div className="line">
                    <img src={plane} height={15} />
                    <p style={{ fontSize: 10 }}>
                        {data.flightDirection === "D"
                            ?
                            hoursDifference(data.scheduleTime.slice(0, -3), addTimeAndFormat(data.scheduleDateTime, 6, 20).amsterdamTime)
                            :
                            hoursDifference(addTimeAndFormat(data.scheduleDateTime, -2, -30).amsterdamTime, data.scheduleTime.slice(0, -3))} (Nonstop)
                    </p>
                </div>
                <div className="line">------</div>
                <div>
                    <div className="icon-and-header">
                        <img src={flight_landing} />
                        <p className="flight-header">Arrival</p>
                    </div>
                    <h5>{data.flightDirection === "A" ? data.scheduleTime.slice(0, -3) : addTimeAndFormat(data.scheduleDateTime, 6, 20).amsterdamTime}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {data.flightDirection === "A" ? "AMS" : data.route.destinations[0]}</p>
                </div>
            </div>
            <div className="price-wrapper">
                <div>
                    <h5 style={{ color: "#4c2897" }}>Price: ${getRandomPrice()}</h5>
                    <p id="p">One Way</p>
                </div>
                <button className="book-flight-button" onClick={() => handleBookFlight()}>
                    Book Flight
                </button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Flights;