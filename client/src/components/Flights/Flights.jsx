import React, { useMemo } from "react";
import './Flights.style.css';
import flight_takeoff from '../../assets/flight_takeoff.svg';
import flight_landing from '../../assets/flight_landing.svg';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plane from '../../assets/plane.svg';
import { hoursDifference, getRandomPrice, addTimeAndFormat } from "../../helpers";
import { Post } from "../../controllers/httpControllers";
import FlightDetail from "./FlightDetail";

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
        const flightDate = new Date(
            isDeparture
                ? data.scheduleDateTime
                : addTimeAndFormat(data.scheduleDateTime, -2, -30).date
        );

        if (flightDate.getTime() < currentDate.getTime()) {
            toast.error("You can't buy past-dated tickets");
            return;
        }
        Post("/save", {
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport,
            scheduleDate: data.scheduleDate
        }).then(() => toast.info("Your flight has been saved"))
    }

    return (
        <div className="flight-container">
            <h5 id="h5">{isDeparture ? `Amsterdam - ${city}` : `${city} - Amsterdam `}</h5>
            <div className="time-container">
                <FlightDetail
                    iconName={flight_takeoff}
                    header="Departure"
                    time={departureTime}
                    airport={departureAirport}
                />
                <div className="line">------</div>
                <div className="line">
                    <img src={plane} height={15} />
                    <p style={{ fontSize: 10 }}>
                        {hoursDifference(departureTime, arrivalTime)} (Nonstop)
                    </p>
                </div>
                <div className="line">------</div>
                <FlightDetail
                    iconName={flight_landing}
                    header="Arrival"
                    time={arrivalTime}
                    airport={arrivalAirport}
                />
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