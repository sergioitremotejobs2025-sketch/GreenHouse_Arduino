const { PING_TIMEOUT, QUEUES_MEASURES } = require('../config/config')
const QueueModule = require('../modules/queue.module')

const { getMicrocontrollers, requestMeasure } = require('../modules/request.module')

const measures = ['humidity', 'light', 'temperature']

const publishMeasure = async measure => {
  const queue = new QueueModule(QUEUES_MEASURES[measure])
  try {
    const micros = await getMicrocontrollers(measure)
    console.log(`[${measure}] Found ${micros.length} microcontrollers`)

    await Promise.all(
      micros.map(async micro => {
        console.log(`[${measure}] Requesting http://${micro.ip}/${micro.measure}...`)
        const response = await requestMeasure(micro)
        if (response) {
          console.log(`[${measure}] Got response from ${micro.ip}, publishing...`)
          await queue.publish(response)
        } else {
          console.log(`[${measure}] Failed to get response from ${micro.ip}`)
        }
      })
    )
  } catch (error) {
    console.error(`[${measure}] error:`, error.message)
  } finally {
    await queue.close()
  }
}

const main = async () => {
  await Promise.all(measures.map(publishMeasure))
  await new Promise(resolve => setTimeout(resolve, PING_TIMEOUT))
}

module.exports = { main }
