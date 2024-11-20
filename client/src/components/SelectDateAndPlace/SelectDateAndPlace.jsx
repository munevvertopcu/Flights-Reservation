import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import './SelectDateAndPlace.style.css';
import plane_take_off from '../../assets/plane_take_off.svg';
import plane_land from '../../assets/plane_land.svg';
import calender from '../../assets/calender.svg';
import plane from '../../assets/plane.svg';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchFlights } from "../../redux/features/flightList/flightListSlice";

function SelectDateAndPlace({route, startDate, setRoute, setStartDate, handleFetchClick}) {

    const [endDate, setEndDate] = useState();
    const [selectionMode, setSelectionMode] = useState(1);

    const updatedSwitchData = (val) => {
        setSelectionMode(val);
    };

    return (
        <div className="select-wrapper">
            <div className="select-header">
                <div className="icon-header">
                    <img className="plane-icon" src={plane} />
                    <h4>BOOK YOUR FLIGHT</h4>
                </div>
                <div className="button-wrapper">
                    <button
                        style={{ backgroundColor: selectionMode == 1 ? '#491b96' : '#e5dfea', color: selectionMode == 1 ? '#fff' : '#491b96' }}
                        className="button-1"
                        onClick={() => updatedSwitchData(1)}
                    >
                        Round Trip</button>
                    <button
                        style={{ backgroundColor: selectionMode == 2 ? '#491b96' : '#e5dfea', color: selectionMode == 2 ? '#fff' : '#491b96' }}
                        className="button-2"
                        onClick={() => updatedSwitchData(2)}
                    >
                        One Way</button>
                </div>
            </div>
            <div className="select-container">
                <div className="input-wrapper">
                    <input className="input-1" defaultValue="Istanbul" placeholder="Istanbul" />
                    <img className="input-icon" src={plane_take_off} />
                </div>
                <div className="input-wrapper">
                    <input className="input-2 plane-icon" value={route} onChange={(text) => setRoute(text.target.value)} />
                    <img className="input-icon" src={plane_land} />
                </div>
                <div className="input-wrapper">
                    <DatePicker className="input-1" dateFormat="yyyy-MM-dd" selected={startDate} onChange={(date) => setStartDate(date)} minDate={new Date()}/>
                    <img className="input-icon" src={calender} />
                </div>
                {
                    selectionMode == 1 &&
                    <div className="input-wrapper">
                        <DatePicker className="input-2" dateFormat="yyyy-MM-dd" selected={endDate} onChange={(date) => setEndDate(date)} minDate={new Date()} />
                        <img className="input-icon" src={calender} />
                    </div>
                }
            </div>
            <button className="show-button" onClick={handleFetchClick}>Show Flights</button>
        </div>
    )
}



export default SelectDateAndPlace;