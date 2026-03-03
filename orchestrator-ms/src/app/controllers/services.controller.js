const axios = require('axios')
const queryString = require('query-string')

const { MEASURE_MS, AI_MS, MICROCONTROLLERS_MS } = require('../../config/services.config')

/**
 * Shared secret sent to measure-ms so that it can reject un-trusted callers.
 * Must match the INTERNAL_API_KEY env var set on the measure-ms pod/container.
 */
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || ''

/** Build request headers, adding the internal key only for measure-ms calls. */
const buildHeaders = (service) => {
  const needsAuth = [MEASURE_MS, AI_MS, MICROCONTROLLERS_MS].includes(service)
  return needsAuth && INTERNAL_API_KEY
    ? { 'x-internal-api-key': INTERNAL_API_KEY }
    : {}
}

const methodToConnectedService = async (res, url, method, body = {}, status = 200, returnResponse = false, headers = {}) => {
  try {
    const config = { headers }
    const response = method === 'get'
      ? await axios.get(url, config)
      : method === 'delete'
        ? await axios.delete(url, { ...config, data: body })
        : await axios[method](url, body, config)

    if (returnResponse) return response
    if (!response.data) return res.sendStatus(404)
    return res.status(status).json(response.data)
  } catch (error) {
    return res.sendStatus(400)
  }
}

module.exports = class ServicesController {

  async getToConnectedService(res, service, path = '', query = {}, returnResponse = false) {
    const url = `http://${service}/${path}?${queryString.stringify(query)}`
    return await methodToConnectedService(res, url, 'get', {}, 200, returnResponse, buildHeaders(service))
  }

  async postToConnectedService(res, service, path = '', body, status, returnResponse) {
    const url = `http://${service}/${path}`
    return await methodToConnectedService(res, url, 'post', body, status, returnResponse, buildHeaders(service))
  }

  async putToConnectedService(res, service, path = '', body, status, returnResponse = false) {
    const url = `http://${service}/${path}`
    return await methodToConnectedService(res, url, 'put', body, status, returnResponse, buildHeaders(service))
  }

  async deleteToConnectedService(res, service, path = '', body) {
    const url = `http://${service}/${path}`
    return await methodToConnectedService(res, url, 'delete', body, 200, false, buildHeaders(service))
  }

}
