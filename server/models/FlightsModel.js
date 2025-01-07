const mongoose = require('mongoose')

const flightsSchema = new mongoose.Schema({
    departureTime: {
        type: String,
        require: true
    },
    arrivalTime: {
        type: String,
        require: true
    },
    departureAirport: {
        type: String,
        require: true
    },
    arrivalAirport: {
        type: String,
        require: true
    },
    scheduleDateTime: {
        type: String,
        require: true
    },
    flightName: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('Flights', flightsSchema)