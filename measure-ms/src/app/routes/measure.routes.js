const { Router } = require('express')

const MeasureController = require('../controllers/measure.controller')

const router = Router()
const humidityController = new MeasureController('humidity')
const lightController = new MeasureController('light')
const temperatureController = new MeasureController('temperature')
const picturesController = new MeasureController('pictures')

router.get('/humidity', humidityController.getMeasure)
router.get('/humidities', humidityController.getMeasures)

router.get('/light', lightController.getMeasure)
router.get('/lights', lightController.getMeasures)
router.post('/light', lightController.postLight)

router.get('/temperature', temperatureController.getMeasure)
router.get('/temperatures', temperatureController.getMeasures)

router.get('/pictures', picturesController.getMeasure)
router.get('/pictures/history', picturesController.getMeasures)

module.exports = router
