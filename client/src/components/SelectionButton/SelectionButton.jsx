import React from "react";
import './SelectionButton.style.css';

function SelectionButton({ selectionMode, updatedSwitchData, buttonName1, buttonName2 }) {

    return (
        <div className="button-wrapper">
            <button
                style={{ backgroundColor: selectionMode == 1 ? '#491b96' : '#e5dfea', color: selectionMode == 1 ? '#fff' : '#491b96' }}
                className="button-1"
                onClick={() => updatedSwitchData(1)}
            >
                {buttonName1}</button>
            <button
                style={{ backgroundColor: selectionMode == 2 ? '#491b96' : '#e5dfea', color: selectionMode == 2 ? '#fff' : '#491b96' }}
                className="button-2"
                onClick={() => updatedSwitchData(2)}
            >
                {buttonName2}</button>
        </div>
    )
}

export default SelectionButton;