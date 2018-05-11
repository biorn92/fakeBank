const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransSchema = new Schema({
  accSend: {type: Schema.Types.ObjectId, ref: 'Account'},
  accRecived: {type: Schema.Types.ObjectId, ref: 'Account'},
  date: {type: Date, default: Date.now()},
  amount: {type: Number, required: true}
})
module.exports = mongoose.model('Transaction', TransSchema)
