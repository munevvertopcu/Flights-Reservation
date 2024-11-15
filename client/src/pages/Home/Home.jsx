import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import './Home.style.css';
import SelectDateAndPlace from "../../components/SelectDateAndPlace";
import airplane_icon from '../../assets/airplane_icon.svg';
import tag from '../../assets/tag.svg';
import world from '../../assets/world.svg';
import Flights from '../../components/Flights';

function Home(props) {

    const flights = useSelector((state) => state.flights.data);

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
                <SelectDateAndPlace />
                {
                    flights?.flights?.length > 0 ?
                        <div className="flight-parent">
                            {
                                flights?.flights?.map((item) =>

                                    <Flights data={item} />


                                )
                            }
                        </div>

                        :
                        null

                }
            </div>
        </div>
    )
}

export default Home;