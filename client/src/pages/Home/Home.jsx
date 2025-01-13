import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
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
import { Modal } from 'antd';

function Home() {

    const [route, setRoute] = useState("");
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [hasFetched, setHasFetched] = useState(false);
    const [city, setCity] = useState("");
    const [showReturnFlights, setShowReturnFlights] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartureFlight, setSelectedDepartureFlight] = useState(null);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { flights, page, totalPages, isLoading, selectionDirectionMode, selectionTripMode, error, statusText } = useSelector((state) => state.flights);

    const scrollContainerRef = useRef(null);

    const handleOk = () => {
        if (selectionTripMode === 1 && !showReturnFlights) {
            fetchReturnFlights();
        }
        else {
            dispatch(resetFlights())
            navigate("/myflights")
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const validateInputs = () => {
        const requiredFields = [route, startDate];
        if (selectionTripMode === 1) requiredFields.push(endDate);

        if (requiredFields.some(field => !field)) {
            toast.error("Please fill in all fields!");
            return false;
        }
        return true;
    };

    const resetDataBeforeFetch = () => {
        dispatch(resetFlights());
        setShowReturnFlights(false);
    };

    const fetchInitialData = async () => {
        await Promise.all([
            dispatch(fetchFlights({
                date: formatDate(startDate),
                route: route,
                page: 0,
                direction: selectionDirectionMode === 1 ? "D" : "A"
            })),
            fetchCityName()
        ]);
        if (statusText === "No Content") {
            toast.error("No flights found for the selected route and date.");
        }
    };

    const handleButtonClick = async () => {
        if (!validateInputs()) return;

        if (!hasFetched) {
            resetDataBeforeFetch();
            await fetchInitialData();
            setHasFetched(true);
        }
    };

    const fetchReturnFlights = () => {
        if (endDate) {
            dispatch(resetFlights())
            dispatch(fetchFlights({
                date: formatDate(endDate),
                route: route,
                page: 0,
                direction: selectionDirectionMode === 1 ? "A" : "D"
            })).then(() => {
                setShowReturnFlights(true);
            });
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
        if (error) {
            toast.error("An error occurred while fetching flights. Please try again. " + error);
        }
    }, [error]);

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
                    if (selectionTripMode === 1 && showReturnFlights) {
                        dispatch(fetchFlights({
                            date: formatDate(endDate),
                            route: route,
                            page: page,
                            direction: selectionDirectionMode === 1 ? "A" : "D"
                        }))
                    } else
                        dispatch(fetchFlights({
                            date: formatDate(startDate),
                            route: route,
                            page: page,
                            direction: selectionDirectionMode === 1 ? "D" : "A"
                        }));
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
    }, [dispatch, startDate, route, page, totalPages, isLoading, showReturnFlights, selectionTripMode, endDate]);

    useEffect(() => {
        setHasFetched(false)
    }, [dispatch, startDate, endDate, route, selectionDirectionMode, selectionTripMode]);

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
                                    <Flights
                                        city={city}
                                        data={item}
                                        key={index}
                                        onFlightBooking={() => setIsModalOpen(true)}
                                        showReturnFlights={showReturnFlights}
                                        selectedDepartureFlight={selectedDepartureFlight}
                                        setSelectedDepartureFlight={setSelectedDepartureFlight}
                                    />
                                )
                            }
                            {
                                isLoading &&
                                <img src="./spinner.svg" className="loading" />
                            }
                        </div>
                }
                <ToastContainer />
                <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    {
                        selectionTripMode === 2 ?
                            <p>Flight booked.</p> :
                            (
                                !showReturnFlights ?
                                    <p>Departure flight selected.
                                        Click on the "OK" button to list return flights.</p> :
                                    <p>Departure and return flights booked.</p>
                            )
                    }
                </Modal>
            </div>
        </div>
    )
}

export default Home;