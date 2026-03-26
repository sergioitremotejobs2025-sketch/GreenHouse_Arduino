const { B_TERMISTOR } = require('../config/config')

const digitalToReal = (digital, sensor) => {
  switch (sensor) {
    case 'Grove - Moisture':
    case 'Fake Grove - Moisture':
    case 'Local Hum 1':
    case 'Cloud Moisture':
      return Number((digital * 100 / 950).toFixed(1))
    case 'Grove - Temperature':
    case 'Fake Grove - Temperature':
    case 'Local Temp 1':
    case 'Cloud Temperature':
      return Number((1 / (Math.log(1023 / digital - 1) / B_TERMISTOR + 1 / 298.15) - 273.15).toFixed(1))
    default:
      return digital // Fallback if unknown sensor
  }
}

const getMessage = (data, micro) => {
  const date = new Date()
  const message = {
    date: date.toUTCString(),
    digital_value: data[micro.measure],
    ip: micro.ip,
    measure: micro.measure,
    sensor: micro.sensor,
    timestamp: date.getTime(),
    username: micro.username
  }

  switch (micro.measure) {
    case 'humidity':
    case 'temperature':
      message.real_value = digitalToReal(data[micro.measure], micro.sensor)
      break
    case 'light':
      break
  }

  return message
}

module.exports = { getMessage }
