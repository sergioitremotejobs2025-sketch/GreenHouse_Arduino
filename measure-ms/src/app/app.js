const cors = require('cors')
const express = require('express')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(require('./routes/measure.routes'))

app.disable('x-powered-by')

// Start the picture scheduler (only in production, not during tests)
if (process.env.NODE_ENV !== 'test') {
  const Dao = require('../database/dao')
  const MicrocontrollersModule = require('../modules/microcontrollers.module')
  const PictureScheduler = require('./schedulers/picture.scheduler')

  const db = new Dao()
  db.connect()
  const microsModule = new MicrocontrollersModule('pictures')
  const scheduler = new PictureScheduler(db, microsModule)
  scheduler.start()
}

module.exports = app
