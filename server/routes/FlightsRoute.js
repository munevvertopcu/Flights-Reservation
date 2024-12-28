const { Router } = require("express")
const { getFlights, saveFlights, deleteFlights, updateFlights } = require("../controllers/FlightsController")

const router = Router()

router.get('/', getFlights)
router.post('/save', saveFlights)
router.post('/delete', deleteFlights)
router.post('/update', updateFlights)

module.exports = router;