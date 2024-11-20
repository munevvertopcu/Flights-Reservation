import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import './Home.style.css';
import SelectDateAndPlace from "../../components/SelectDateAndPlace";
import airplane_icon from '../../assets/airplane_icon.svg';
import tag from '../../assets/tag.svg';
import world from '../../assets/world.svg';
import Flights from '../../components/Flights';
import { fetchFlights, resetFlights } from "../../redux/features/flightList/flightListSlice";

function Home(props) {

    const [route, setRoute] = useState("");
    const [startDate, setStartDate] = useState();
    const [hasFetched, setHasFetched] = useState(false);
    const [city, setCity] = useState("");

    const dispatch = useDispatch();
    const { flights, page, totalPages, isLoading } = useSelector((state) => state.flights);

    const scrollContainerRef = useRef(null);

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const handleButtonClick = () => {
        if (!hasFetched) {
            dispatch(fetchFlights({ date: formatDate(startDate), route: route, page: page }));
            fetchCityName();
            setHasFetched(true);
        }
    };

    const fetchCityName = async () => {
        try {
            const response = await axios.get(`/api/public-flights/destinations/${route}`, {
                headers: {
                    'app_id': 'c1ac8def',
                    'app_key': 'bdd4fde3528d88146542630a1a2a5d47',
                    'ResourceVersion': 'v4',
                    'Accept': 'application/json',
                }
            })
            setCity(response.data.city);
            console.log(response.data.city)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const container = scrollContainerRef.current;
            if (!container) return;

            // Scroll'un sonuna yaklaştığımızı kontrol et
            if (
                container.scrollTop + container.clientHeight >=
                container.scrollHeight * 0.9
            ) {
                if (!isLoading && page <= totalPages) {
                    dispatch(fetchFlights({ date: formatDate(startDate), route: route, page: page }));
                }
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [dispatch, startDate, route, page, totalPages, isLoading]);

    useEffect(() => {
        dispatch(resetFlights());
        setHasFetched(false);
    }, [dispatch, startDate, route]);

    return (
        <div className='container'>
            <div className='card'>
                <div className="header">
                    <div className="icon-container">
                        <img className="icon" src={airplane_icon} />
                        <p className="icon-name">PLANE SCAPE</p>
                    </div>
                    <div className="icon-container">
                        <img className="icon" src={tag} />
                        <p className="text">Deals</p>
                        <img className="icon" src={world} />
                        <p>Discover</p>
                    </div>
                </div>
                <SelectDateAndPlace route={route} startDate={startDate} setRoute={setRoute} setStartDate={setStartDate} handleFetchClick={handleButtonClick} />
                {
                    flights?.length > 0 ?
                        <div className="flight-parent" ref={scrollContainerRef}>
                            {
                                flights?.map((item) =>
                                    <Flights city={city} data={item} />
                                )
                            }
                        </div>
                        :
                        isLoading ?
                            <img width={50} height={50} src="./spinner.svg" className="loading" />

                            : null
                }

            </div>
        </div>
    )
}

export default Home;