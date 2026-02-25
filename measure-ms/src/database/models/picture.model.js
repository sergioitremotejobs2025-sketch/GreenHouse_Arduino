const { model, Schema } = require('mongoose')

module.exports = model(
    'Picture',
    new Schema({
        date: String,
        timestamp: Number,
        ip: String,
        sensor: String,
        username: String,
        measure: String,
        stage: String,
        stage_id: Number,
        elapsed_minutes: String,
        image_url: String,
        init_timestamp: Number,
        end_timestamp: Number
    })
)
