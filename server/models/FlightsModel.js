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
    scheduleDate: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Flights', flightsSchema)