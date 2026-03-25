const axios = require('axios')

const { MICROCONTROLLERS_MS, PING_TIMEOUT } = require('../config/config')
const { getMessage } = require('../modules/message.module')

const getMicrocontrollers = async measure => {
  const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || ''
  const config = INTERNAL_API_KEY ? { headers: { 'x-internal-api-key': INTERNAL_API_KEY } } : {}
  const response = await axios.get(`http://${MICROCONTROLLERS_MS}/${measure}`, config)
  return response.data
}

const requestMeasure = async micro => {
  try {
    const response = await axios.get(`http://${micro.ip}/${micro.measure}`, { timeout: PING_TIMEOUT })
    return getMessage(response.data, micro)
  } catch (error) {
    // skip silent
  }
}

module.exports = { getMicrocontrollers, requestMeasure }
