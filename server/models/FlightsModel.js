const mongoose = require('mongoose')

const flightsSchema = new mongoose.Schema({
    scheduleTime: {
        type: String,
        require: true
    },
    flightDirection: {
        type: String,
        require: true
    },
    route: {
        type: String,
        require: true
    },
    scheduleDate: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Flights', flightsSchema)