const FlightsModel = require('../models/FlightsModel')

module.exports.getFlights = async (req, res) => {
    const flights = await FlightsModel.find()
    res.send(flights)
}

module.exports.saveFlights = async (req, res) => {

    const { text } = req.body

    FlightsModel
        .create({ text })
        .then((data) => {
            console.log("Added successfully...");
            console.log(data);
            res.send(data)
        })
}

