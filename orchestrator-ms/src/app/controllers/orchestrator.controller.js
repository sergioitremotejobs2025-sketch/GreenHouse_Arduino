const { AUTH_MS, MEASURE_MS, MICROCONTROLLERS_MS, AI_MS } = require('../../config/services.config')
const { hashPassword } = require('../../helpers/helpers')

const JwtModule = require('../../modules/jwt.module')
const ServicesController = require('./services.controller')

const jwt = new JwtModule()
const servicesController = new ServicesController()

const doAuth = async (req, res, path) => {
  const body = req.body
  if (!body.password || !body.username) return res.sendStatus(400)

  body.password = hashPassword(body.password)
  body.refreshToken = jwt.generateRefreshToken()

  const response = await servicesController.postToConnectedService(res, AUTH_MS, path, body, null, true)
  if (String(response.data) !== 'true') return res.sendStatus(401)

  const accessToken = jwt.generateToken({ username: body.username })
  return res.json({ accessToken, refreshToken: body.refreshToken })
}

module.exports = class OrchestratorController {

  async getMeasureService(req, res) {
    let { path, ...query } = req.query
    if (!path) path = req.route.path.substring(1)
    query.username = req.user.username

    // Call service but get full response to broadcast it
    const response = await servicesController.getToConnectedService(res, MEASURE_MS, path, query, true)

    if (response && response.data) {
      const io = req.app.get('io');
      if (io) {
        // Broadcast the measurement update to all clients
        io.emit('measure_update', {
          measure: path,
          data: response.data,
          username: req.user.username
        });
      }
      return res.json(response.data);
    }
    if (!res.headersSent) {
      return res.sendStatus(404);
    }
  }

  async postMeasureService(req, res) {
    let { path, ...body } = req.body
    if (!path) path = req.route.path.substring(1)
    body.username = req.user.username
    await servicesController.postToConnectedService(res, MEASURE_MS, path, body, 201)

  }

  async login(req, res) {
    await doAuth(req, res, 'login')
  }

  async register(req, res) {
    await doAuth(req, res, 'register')
  }

  async refresh(req, res) {
    const accessToken = jwt.getTokenFromHeaders(req.headers)
    const { refreshToken } = req.body
    const payload = jwt.getPayload(accessToken)

    if (!refreshToken || !accessToken || !payload || !payload.username) return res.sendStatus(400)
    if (!jwt.isRefreshable(accessToken)) return res.sendStatus(401)

    const newRefreshToken = jwt.generateRefreshToken()
    const { username } = payload
    const body = { newRefreshToken, refreshToken, username }
    const response = await servicesController.postToConnectedService(res, AUTH_MS, 'refresh', body, null, true)

    if (!response.data) return res.sendStatus(400)
    return res.json({
      accessToken: jwt.generateToken({ username }),
      refreshToken: newRefreshToken
    })
  }

  async getMicrocontrollers(req, res) {
    const { username } = req.user
    await servicesController.getToConnectedService(res, MICROCONTROLLERS_MS, undefined, { username })
  }

  async postMicrocontrollers(req, res) {
    const microcontroller = req.body
    // Ensure username is present
    microcontroller.username = req.user.username
    await servicesController.postToConnectedService(res, MICROCONTROLLERS_MS, undefined, microcontroller, 201)
  }

  async putMicrocontrollers(req, res) {
    const updatedMicrocontroller = req.body
    // Ensure username is present
    updatedMicrocontroller.username = req.user.username
    await servicesController.putToConnectedService(res, MICROCONTROLLERS_MS, undefined, updatedMicrocontroller, 201)
  }

  async deleteMicrocontrollers(req, res) {
    const { ip, measure } = req.query
    await servicesController.deleteToConnectedService(
      res,
      MICROCONTROLLERS_MS,
      undefined,
      {
        ip,
        measure,
        username: req.user.username
      }
    )
  }

  async changePassword(req, res) {
    const { password } = req.body
    if (!password) return res.sendStatus(400)

    const body = {
      username: req.user.username,
      password: hashPassword(password)
    }

    const response = await servicesController.putToConnectedService(res, AUTH_MS, 'change-password', body, null, true)
    if (!response.data) return res.sendStatus(400)
    return res.json({ success: response.data === 'true' })
  }

  async trainAI(req, res) {
    const { ip, measure, limit } = req.body
    const body = {
      username: req.user.username,
      ip,
      measure,
      limit: limit || 1000
    }
    await servicesController.postToConnectedService(res, AI_MS, 'train', body)
  }

  async predictAI(req, res) {
    const { ip, measure, recent_values } = req.body
    const body = {
      username: req.user.username,
      ip,
      measure,
      recent_values
    }
    await servicesController.postToConnectedService(res, AI_MS, 'predict', body)
  }

  async evaluateAI(req, res) {
    const { ip, measure } = req.body
    const body = {
      username: req.user.username,
      ip,
      measure
    }
    await servicesController.postToConnectedService(res, AI_MS, 'evaluate', body)
  }

}
