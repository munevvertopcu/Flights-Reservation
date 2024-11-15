import React, { useEffect, useState } from "react";
import './Flights.style.css';
import axios from "axios";

function Flights({ data }) {

    const [city, setCity] = useState("");

    useEffect(() => {
        async function fetchCityName() {
            try {
                const response = await axios.get(`/api/public-flights/destinations/${data.route.destinations[0]}`, {
                    headers: {
                        'app_id': 'c1ac8def',
                        'app_key': 'bdd4fde3528d88146542630a1a2a5d47',
                        'ResourceVersion': 'v4',
                        'Accept': 'application/json',
                    }
                })
                setCity(response.data.city)
            } catch (error) {
                console.log(error)
            }
        }
        fetchCityName();
    }, [data]);

    return (
        <div className="flight-container">
            <h3>{`Istanbul - ${city}`}</h3>
        </div>
    )
}

export default Flights;