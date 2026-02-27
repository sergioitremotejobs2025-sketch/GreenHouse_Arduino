const { model, Schema } = require('mongoose')

const lightSchema = new Schema({
  digital_values: Array,
  end_date: Date,
  end_timestamp: Number,
  init_date: Date,
  init_timestamp: Number,
  ip: String,
  mean_value: Number,
  measure: String,
  n_samples: Number,
  sensor: String,
  time_span: Number,
  username: String
})

lightSchema.index({ ip: 1, username: 1, init_timestamp: 1, end_timestamp: 1 })

module.exports = model('Light', lightSchema)
