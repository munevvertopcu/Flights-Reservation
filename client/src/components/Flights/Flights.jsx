import React from "react";
import './Flights.style.css';
import flight_takeoff from '../../assets/flight_takeoff.svg';
import flight_landing from '../../assets/flight_landing.svg';
import plane from '../../assets/plane.svg'

function Flights({ data, city }) {

    function getTime(timeString, hoursToAdd, minutesToAdd) {
        // "hh:mm" formatındaki stringi parçala
        const [hours, minutes] = timeString.split(':').map(Number);
    
        // Toplam dakikayı hesapla
        const totalMinutes = (hours * 60 + minutes) + (hoursToAdd * 60 + minutesToAdd);
    
        // Yeni saat ve dakikayı hesapla
        const newHours = Math.floor(totalMinutes / 60) % 24; // 24 saat formatında döngü
        const newMinutes = totalMinutes % 60;
    
        // Sonucu "hh:mm" formatında döndür
        const formattedHours = newHours.toString().padStart(2, '0');
        const formattedMinutes = newMinutes.toString().padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}`;
    }

    function hoursDifference(start, end) {
        // Saat ve dakikaları ayır
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);

        // Toplam dakikaya çevir
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;

        // Dakika farkını hesapla
        let diffMinutes = endTotalMinutes - startTotalMinutes;

        // Eğer fark negatifse, bir gün ekle (24 saat)
        if (diffMinutes < 0) {
            diffMinutes += 24 * 60;
        }

        // Farkı saat ve dakikaya dönüştür
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;

        // Sonucu "xh ym" formatında döndür
        return `${diffHours}h ${remainingMinutes}m`;
    }

    return (
        <div className="flight-container">
            <h5>{data.flightDirection === "D" ? `Amsterdam - ${city}` : `${city} - Amsterdam `}</h5>
            <div className="time-container">
                <div>
                    <div className="icon-and-header">
                        <img src={flight_takeoff} />
                        <p className="flight-header">Departure</p>
                    </div>
                    <h5>{data.flightDirection === "D" ? data.scheduleTime.slice(0, -3) : getTime(data.scheduleTime.slice(0, -3), -2, -30)}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {data.flightDirection === "D" ? "AMS" : data.route.destinations[0]}</p>
                </div>
                <div className="line">------</div>
                <div className="line">
                    <img src={plane} height={15}/>
                    <p style={{ fontSize: 10 }}>{data.flightDirection === "D" ? hoursDifference(data.scheduleTime.slice(0, -3), getTime(data.scheduleTime.slice(0, -3), 6, 20)) : hoursDifference(getTime(data.scheduleTime.slice(0, -3), -2, -30), data.scheduleTime.slice(0, -3))} (Nonstop)</p>
                </div>
                <div className="line">------</div>
                <div>
                    <div className="icon-and-header">
                        <img src={flight_landing} />
                        <p className="flight-header">Arrival</p>
                    </div>
                    <h5>{data.flightDirection === "A" ? data.scheduleTime.slice(0, -3) : getTime(data.scheduleTime.slice(0, -3), 6, 20)}</h5>
                    <p style={{ fontSize: 10 }} >Airport: {data.flightDirection === "A" ? "AMS" : data.route.destinations[0]}</p>
                </div>
            </div>
        </div>
    )
}

export default Flights;