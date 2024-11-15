const mongoose = require('mongoose')

const flightsSchema = new mongoose.Schema({
    text:{
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Flights', flightsSchema)