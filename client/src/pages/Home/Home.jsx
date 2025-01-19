import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import './Home.style.css';
import instance from "../../services/instance";
import SelectDateAndPlace from "../../components/SelectDateAndPlace";
import airplane_icon from '../../assets/airplane_icon.svg';
import tag from '../../assets/tag.svg';
import world from '../../assets/world.svg';
import Flights from '../../components/Flights';
import SortAndFilterFlights from "../../components/SortAndFilterFlights";
import { fetchFlights, resetFlights, } from "../../redux/features/flightList/flightListSlice";
import { formatDate, getScheduleDateTime } from "../../helpers";
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
    const [sortCriteria, setSortCriteria] = useState("recommended");
    const [filterCriteria, setFilterCriteria] = useState("No Filter");

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { flights, page, totalPages, isLoading, selectionDirectionMode, selectionTripMode, error, statusText } = useSelector((state) => state.flights);

    const scrollContainerRef = useRef(null);
    const hasFlights = flights?.length > 0;
    const isEmptyState = isLoading && !hasFlights;

    const handleOk = () => {
        resetDataBeforeFetch();
        if (selectionTripMode === 1 && !showReturnFlights) {
            fetchReturnFlights();
        }
        else {
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
        setFilterCriteria("No Filter");
        setSortCriteria("recommended");
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

    const sortedFlights = [...flights].sort((a, b) => {
        switch (sortCriteria) {
            case "newest-time":
                return new Date(b.scheduleDateTime) - new Date(a.scheduleDateTime);
            case "oldest-time":
                return new Date(a.scheduleDateTime) - new Date(b.scheduleDateTime);
            default:
                return 0;
        }
    });

    const filteredFlights = sortedFlights.filter(flight => {
        if (!filterCriteria || filterCriteria === "No Filter") return true;

        const timeRanges = {
            "05:00 - 11:59": [5, 12],
            "12:00 - 21:59": [12, 22],
        };

        const flightDate = getScheduleDateTime(flight);
        const options = { timeZone: "Europe/Amsterdam", hour: "2-digit", hourCycle: "h23" };
        const flightHour = parseInt(new Intl.DateTimeFormat("en-US", options).format(flightDate), 10);

        const [start, end] = timeRanges[filterCriteria];
        return flightHour >= start && flightHour < end;
    });

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
                        <a href="https://www.schiphol.nl/en/at-schiphol/shop/" target="_blank" className="text">Deals</a>
                        <img className="icon" src={world} />
                        <Link to="/myflights">Reservations</Link>
                    </div>
                </div>
                <div className="image-and-flights">
                    <div className="flights-wrapper">
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
                            isEmptyState ?
                                <img src="./spinner.svg" className="spinner" /> :
                                hasFlights &&
                                <div className="flight-parent" >
                                    <div className="flight-card" ref={scrollContainerRef}>
                                        {
                                            filteredFlights?.map((item, index) =>
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
                                    <SortAndFilterFlights
                                        setSortCriteria={setSortCriteria}
                                        setFilterCriteria={setFilterCriteria}
                                        filterCriteria={filterCriteria} />
                                </div>
                        }
                    </div>
                    <div className="image-container">
                        <img src="./plane-image.jpg" alt="Image 1" className="custom-image" />
                        <img src="./schipol.jpg" alt="Image 2" className="custom-image" />
                        <img src="./amsterdam.jpg" alt="Image 3" className="custom-image" />
                    </div>
                </div>
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