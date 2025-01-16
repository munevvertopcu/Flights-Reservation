import React from "react";
import './SortAndFilterFlights.style.css';

function SortAndFilterFlights({ setSortCriteria, setFilterCriteria, filterCriteria }) {

    const onOptionChange = e => {
        setFilterCriteria(e.target.value);
    }

    return (
        <div className="sort-container">
            <label className="label-text">Sort by:  </label>
            <select id="sort-flight" onChange={(e) => setSortCriteria(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="newest-time">Newest Time</option>
                <option value="oldest-time">Oldest Time</option>
            </select>
            <label className="label-text">Departure Time</label>
            <div>
                <input
                    type="radio"
                    name="filterCriteria"
                    value="No Filter"
                    id="time-0"
                    onChange={onOptionChange}
                    checked={filterCriteria === "No Filter"} />
                <label htmlFor="time-0">No Filter</label>
            </div>
            <div>
                <input
                    type="radio"
                    name="filterCriteria"
                    value="05:00 - 11:59"
                    id="time-1"
                    onChange={onOptionChange}
                    checked={filterCriteria === "05:00 - 11:59"} />
                <label htmlFor="time-1">05:00 - 11:59</label>
            </div>
            <div>
                <input
                    type="radio"
                    name="filterCriteria"
                    value="12:00 - 21:59"
                    id="time-2"
                    onChange={onOptionChange}
                    checked={filterCriteria === "12:00 - 21:59"} />
                <label htmlFor="time-2">12:00 - 21:59</label>
            </div>
        </div>
    )
}

export default SortAndFilterFlights;