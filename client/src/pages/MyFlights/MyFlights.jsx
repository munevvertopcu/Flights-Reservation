import React, { useState, useEffect } from "react";
import './MyFlights.style.css';
import { Get } from "../../controllers/httpControllers";
import Reservation from "../../components/Reservation";

function MyFlights() {

    const [myFlights, setMyFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortCriteria, setSortCriteria] = useState("recommended");

    useEffect(() => {
        const getMyFlights = async () => {
            try {
                setLoading(true);
                const response = await Get();
                setMyFlights(response)
                console.log(response)
            } catch (error) {
                console.error('Error during GET:', error);
            } finally {
                setLoading(false);
            }
        }
        getMyFlights();
    }, [])

    const sortedFlights = [...myFlights].sort((a, b) => {
        switch (sortCriteria) {
            case "price":
                return b.price - a.price;
            case "time":
                return new Date(b.scheduleDateTime) - new Date(a.scheduleDateTime);
            default:
                return 0;
        }
    });

    return (
        <div id="container">
            {
                myFlights?.length === 0 ?
                    <h5 className="loading-icon">There is no flight ticket you purchased</h5> :
                    (
                        loading ?
                            <img src="./spinner.svg" className="loading-icon" /> :
                            <div className="reservation-container">
                                <div className="header-container">
                                    <div>
                                        <label>Sort by:  </label>
                                        <select style={{ fontWeight: "bold" }} id="sort" onChange={(e) => setSortCriteria(e.target.value)} >
                                            <option value="recommended">Recommended</option>
                                            <option value="price">Price</option>
                                            <option value="time">Time</option>
                                        </select>
                                    </div>
                                    <h5>Avg price: $324</h5>
                                </div>
                                {
                                    sortedFlights.map((item, index) => {
                                        return (
                                            <Reservation data={item} key={index} />
                                        )
                                    })
                                }
                            </div>
                    )
            }
        </div>

    )
}

export default MyFlights;