const { Router } = require("express")
const { getFlights, saveFlights } = require("../controllers/FlightsController")

const router = Router()

router.get('/', getFlights)
router.post('/save', saveFlights)

module.exports = router;