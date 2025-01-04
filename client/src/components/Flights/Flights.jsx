import React, { useMemo } from "react";
import './Flights.style.css';
import flight_takeoff from '../../assets/flight_takeoff.svg';
import flight_landing from '../../assets/flight_landing.svg';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plane from '../../assets/plane.svg';
import { hoursDifference, getRandomPrice, addTimeAndFormat, calculateFlightDate } from "../../helpers";
import { Post } from "../../controllers/httpControllers";

function Flights({ data, city }) {

    const isDeparture = data.flightDirection === "D";
    const departureAirport = isDeparture ? "AMS" : data.route.destinations[0];
    const arrivalAirport = isDeparture ? data.route.destinations[0] : "AMS";

    const departureTime = useMemo(() => {
        return data.flightDirection === "D"
            ? data.scheduleTime.slice(0, -3)
            : addTimeAndFormat(data.scheduleDateTime, -2, -30).amsterdamTime;
    }, [data.flightDirection, data.scheduleTime, data.scheduleDateTime]);

    const arrivalTime = useMemo(() => {
        return data.flightDirection === "A"
            ? data.scheduleTime.slice(0, -3)
            : addTimeAndFormat(data.scheduleDateTime, 6, 20).amsterdamTime;
    }, [data.flightDirection, data.scheduleTime, data.scheduleDateTime]);

    function handleFlightBooking() {

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
            <h5 id="h5">{isDeparture ? `Amsterdam - ${city}` : `${city} - Amsterdam `}</h5>
            <div className="time-container">
                <div>
                    <div className="icon-and-header">
                        <img src={flight_takeoff} />
                        <p className="flight-header">Departure</p>
                    </div>
                    <h5>{departureTime}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {departureAirport}</p>
                </div>
                <div className="line">------</div>
                <div className="line">
                    <img src={plane} height={15} />
                    <p style={{ fontSize: 10 }}>
                        {hoursDifference(departureTime, arrivalTime)} (Nonstop)
                    </p>
                </div>
                <div className="line">------</div>
                <div>
                    <div className="icon-and-header">
                        <img src={flight_landing} />
                        <p className="flight-header">Arrival</p>
                    </div>
                    <h5>{arrivalTime}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {arrivalAirport}</p>
                </div>
            </div>
            <div className="price-wrapper">
                <div>
                    <h5 style={{ color: "#4c2897" }}>Price: ${getRandomPrice()}</h5>
                    <p id="p">One Way</p>
                </div>
                <button className="book-flight-button" onClick={() => handleFlightBooking()}>
                    Book Flight
                </button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Flights;