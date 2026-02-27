const humidities = require('../humidities.json')
const lights = require('../lights.json')
const pictures = require('../pictures.json')
const temperatures = require('../temperatures.json')

const makeModel = (name) => {
  // Returns a constructor whose instances have .save(), plus a static .find()
  function MockModel(doc) {
    Object.assign(this, doc)
  }

  MockModel.find = (doc, keys) => {
    if (doc.ip && doc.username && doc.init_timestamp && doc.end_timestamp &&
      doc.init_timestamp['$gte'] && doc.end_timestamp['$lte']) {

      if (name === 'Humidity') return Promise.resolve([humidities[0]])
      if (name === 'Light') return Promise.resolve([lights[0]])
      if (name === 'Temperature') return Promise.resolve([temperatures[0]])
      if (name === 'Picture') return Promise.resolve([pictures[0]])
    }
    return Promise.resolve([])
  }

  MockModel.prototype.save = function () {
    return Promise.resolve(this)
  }

  return MockModel
}

module.exports = {
  connect: (url, options) => {
    return Promise.resolve()
  },
  model: (name, schema) => makeModel(name),
  connection: {
    on: (event, cb) => { cb(event) },
    once: (event, cb) => { cb(event) }
  },
  Schema: class {
    constructor(schema) { this.schema = schema }
    index() { /* no-op in tests */ }
  }
}
