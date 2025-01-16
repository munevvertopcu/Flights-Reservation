import React, { useState } from "react";
import './SelectDateAndPlace.style.css';
import plane_take_off from '../../assets/plane_take_off.svg';
import plane_land from '../../assets/plane_land.svg';
import calender from '../../assets/calender.svg';
import plane from '../../assets/plane.svg';
import DatePicker from "react-datepicker";
import SelectionButton from "../SelectionButton";
import { useSelector, useDispatch } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { setSelectionTripMode, setSelectionDirectionMode } from "../../redux/features/flightList/flightListSlice";

function SelectDateAndPlace({ route, startDate, setRoute, setStartDate, handleFetchClick, endDate, setEndDate }) {

    const { selectionTripMode, selectionDirectionMode } = useSelector((state) => state.flights);
    const dispatch = useDispatch();

    const updatedSwitchDirection = (val) => {
        dispatch(setSelectionDirectionMode(val));
    };

    const updatedSwitchTrip = (val) => {
        dispatch(setSelectionTripMode(val));
    };

    return (
        <div className="select-wrapper">
            <div className="select-header">
                <div className="icon-header">
                    <img className="plane-icon" src={plane} />
                    <h4>BOOK YOUR FLIGHT</h4>
                </div>
                <div className="select-button">
                    <SelectionButton
                        selectionMode={selectionDirectionMode}
                        updatedSwitchData={updatedSwitchDirection}
                        buttonName1="Departure"
                        buttonName2="Arrival" />
                    <SelectionButton
                        selectionMode={selectionTripMode}
                        updatedSwitchData={updatedSwitchTrip}
                        buttonName1="Round Trip"
                        buttonName2="One Way" />
                </div>
            </div>
            <div className="select-container">
                <div className="input-wrapper">
                    <input
                        className="input-1"
                        value={selectionDirectionMode === 1 ? "Amsterdam" : route}
                        onChange={(text) => setRoute(text.target.value)} />
                    <img className="input-icon" src={plane_take_off} />
                </div>
                <div className="input-wrapper">
                    <input
                        className="input-2 plane-icon"
                        value={selectionDirectionMode === 2 ? "Amsterdam" : route}
                        onChange={(text) => setRoute(text.target.value)} />
                    <img className="input-icon" src={plane_land} />
                </div>
                <div className="input-wrapper">
                    <DatePicker
                        className="input-1"
                        dateFormat="yyyy-MM-dd"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={new Date()} />
                    <img className="input-icon" src={calender} />
                </div>
                {
                    selectionTripMode == 1 &&
                    <div className="input-wrapper">
                        <DatePicker
                            className="input-2"
                            dateFormat="yyyy-MM-dd"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={new Date(startDate)} />
                        <img className="input-icon" src={calender} />
                    </div>
                }
            </div>
            <button className="show-button" onClick={handleFetchClick}>Show Flights</button>
        </div>
    )
}

export default SelectDateAndPlace;