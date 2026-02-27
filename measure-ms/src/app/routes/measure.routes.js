const { Router } = require('express')

const MeasureController = require('../controllers/measure.controller')
const { requireInternalKey } = require('../middleware/internal-auth.middleware')

const router = Router()

// Guard every data route with the internal API-key middleware
router.use(requireInternalKey)

// Build controllers dynamically to avoid repetition
const MEASURES = ['humidity', 'light', 'temperature', 'pictures']

const controllers = MEASURES.reduce((acc, m) => {
    acc[m] = new MeasureController(m)
    return acc
}, {})

const { humidity, light, temperature, pictures } = controllers

router.get('/humidity', humidity.getMeasure)
router.get('/humidities', humidity.getMeasures)

router.get('/light', light.getMeasure)
router.get('/lights', light.getMeasures)
router.post('/light', light.postLight)

router.get('/temperature', temperature.getMeasure)
router.get('/temperatures', temperature.getMeasures)

router.get('/pictures', pictures.getMeasure)
router.get('/pictures/history', pictures.getMeasures)

module.exports = router
