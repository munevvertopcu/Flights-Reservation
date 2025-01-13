import React, { useMemo, useState } from "react";
import './Flights.style.css';
import flight_takeoff from '../../assets/flight_takeoff.svg';
import flight_landing from '../../assets/flight_landing.svg';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plane from '../../assets/plane.svg';
import { hoursDifference, getRandomPrice, addTimeAndFormat, getScheduleDateTime } from "../../helpers";
import { Post } from "../../controllers/httpControllers";
import FlightDetail from "./FlightDetail";
import { useSelector } from 'react-redux';

function Flights({ data, city, onFlightBooking, showReturnFlights, setSelectedDepartureFlight, selectedDepartureFlight }) {

    const [loading, setLoading] = useState(false);

    const { selectionTripMode } = useSelector((state) => state.flights);

    const isDeparture = data.flightDirection === "D";
    const departureAirport = isDeparture ? "AMS" : data.route.destinations[0];
    const arrivalAirport = isDeparture ? data.route.destinations[0] : "AMS";

    const departureTime = useMemo(() => {
        return isDeparture
            ? data.scheduleTime.slice(0, -3)
            : addTimeAndFormat(data.scheduleDateTime, -2, -30).amsterdamTime;
    }, [data.flightDirection, data.scheduleTime, data.scheduleDateTime]);

    const arrivalTime = useMemo(() => {
        return !isDeparture
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

        const flightDetails = {
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport,
            scheduleDateTime: getScheduleDateTime(data),
            flightName: data.flightName,
            price: getRandomPrice()
        };

        if (selectionTripMode === 2) {
            setLoading(true);
            Post("/save", flightDetails)
                .then(() => {
                    onFlightBooking();
                }).catch((error) => {
                    console.log("Error saving flight:", error);
                    toast.error("Something went wrong while booking the flight");
                }).finally(() => {
                    setLoading(false);
                });
        } else {
            if (!showReturnFlights) {
                setSelectedDepartureFlight(flightDetails);
                onFlightBooking();
                return;
            }

            setLoading(true);
            Promise.all(
                [
                    Post("/save", selectedDepartureFlight),
                    Post("/save", flightDetails)
                ]
            ).then(() => {
                onFlightBooking();
            }).catch((error) => {
                console.log("Error saving flight:", error);
                toast.error("Something went wrong while booking the flight");
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    return (
        <div className="flight-container" >
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
                {
                    loading ? <img src="./spinner.svg" /> :
                        <button className="book-flight-button" onClick={() => handleFlightBooking()}>
                            {!showReturnFlights && selectionTripMode === 1 ?
                                "Select & Continue" :
                                "Book Flight"
                            }
                        </button>
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Flights;