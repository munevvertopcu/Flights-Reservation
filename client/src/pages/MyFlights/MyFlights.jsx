import React, { useState, useEffect } from "react";
import './MyFlights.style.css';
import { Get } from "../../controllers/httpControllers";
import { getAveragePrice } from "../../helpers";
import Reservation from "../../components/Reservation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                toast.error("An error occurred while fetching reservations. Please try again. ")
            } finally {
                setLoading(false);
            }
        }
        getMyFlights();
    }, [])

    const sortedFlights = [...myFlights].sort((a, b) => {
        switch (sortCriteria) {
            case "highest-price":
                return b.price - a.price;
            case "lowest-price":
                return a.price - b.price;
            case "newest-time":
                return new Date(b.scheduleDateTime) - new Date(a.scheduleDateTime);
            case "oldest-time":
                return new Date(a.scheduleDateTime) - new Date(b.scheduleDateTime);
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
                                        <select id="sort" onChange={(e) => setSortCriteria(e.target.value)} >
                                            <option value="recommended">Recommended</option>
                                            <option value="highest-price">Highest Price</option>
                                            <option value="lowest-price">Lowest Price</option>
                                            <option value="newest-time">Newest Time</option>
                                            <option value="oldest-time">Oldest Time</option>
                                        </select>
                                    </div>
                                    <h5>Avg price: ${getAveragePrice(myFlights)}</h5>
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
            <ToastContainer />
        </div>
    )
}

export default MyFlights;