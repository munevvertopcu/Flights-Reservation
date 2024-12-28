const FlightsModel = require('../models/FlightsModel')

module.exports.getFlights = async (req, res) => {
    const flights = await FlightsModel.find()
    res.send(flights)
}

module.exports.saveFlights = async (req, res) => {

    const { scheduleTime, flightDirection, route, scheduleDate } = req.body

    FlightsModel
        .create({ scheduleTime, flightDirection, route, scheduleDate })
        .then((data) => {
            console.log("Added successfully...");
            console.log(data);
            res.send(data)
        })
}

module.exports.updateFlights = async (req, res) => {
    const { _id, text } = req.body
    FlightsModel
        .findByIdAndUpdate(_id, { text })
        .then(() => res.send("Updated successfully"))
        .catch((err) => console.log(err))
}

module.exports.deleteFlights = async (req, res) => {
    const { _id } = req.body
    FlightsModel
        .findByIdAndDelete(_id)
        .then(() => res.send("Deleted successfully"))
        .catch((err) => console.log(err))
}

