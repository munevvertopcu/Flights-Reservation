import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Home.style.css';
import instance from "../../services/instance";
import SelectDateAndPlace from "../../components/SelectDateAndPlace";
import airplane_icon from '../../assets/airplane_icon.svg';
import tag from '../../assets/tag.svg';
import world from '../../assets/world.svg';
import Flights from '../../components/Flights';
import { fetchFlights, resetFlights, } from "../../redux/features/flightList/flightListSlice";
import { formatDate } from "../../helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {

    const [route, setRoute] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [hasFetched, setHasFetched] = useState(false);
    const [city, setCity] = useState("");

    const dispatch = useDispatch();
    const { flights, page, totalPages, isLoading, selectionDirectionMode, selectionTripMode } = useSelector((state) => state.flights);

    const scrollContainerRef = useRef(null);

    const handleButtonClick = async () => {

        const requiredFields = [route, startDate];
        if (selectionTripMode === 1) requiredFields.push(endDate);

        if (requiredFields.some(field => !field)) {
            toast.error("Please fill in all fields!");
            return;
        }

        if (!hasFetched) {
            dispatch(resetFlights());
            await Promise.all([
                dispatch(fetchFlights({ date: formatDate(startDate), route: route, page: 0, direction: selectionDirectionMode === 1 ? "D" : "A" })),
                fetchCityName()
            ]);
            setHasFetched(true);
        }
    };

    const fetchCityName = async () => {
        try {
            const response = await instance.get(`/destinations/${route}`)
            setCity(response.data.city);
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
                    dispatch(fetchFlights({ date: formatDate(startDate), route: route, page: page, direction: selectionDirectionMode === 1 ? "D" : "A" }));
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
        setHasFetched(false)
    }, [dispatch, startDate, route, selectionDirectionMode]);

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
                <SelectDateAndPlace
                    route={route}
                    startDate={startDate}
                    setRoute={setRoute}
                    setStartDate={setStartDate}
                    handleFetchClick={handleButtonClick}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />
                {
                    isLoading && flights?.length == 0 ?
                        <img src="./spinner.svg" className="spinner" /> :
                        <div className="flight-parent" ref={scrollContainerRef}>
                            {
                                flights?.map((item, index) =>
                                    <Flights city={city} data={item} key={index} />
                                )
                            }
                            {
                                isLoading &&
                                <img src="./spinner.svg" className="loading" />
                            }
                        </div>
                }
                <ToastContainer />
            </div>
        </div>
    )
}

export default Home;