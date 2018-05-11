const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  transSend: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
  transRecived: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
  count: {type: Number, required: true, default: 0},
  iban: {type: String, unique: true}
})
module.exports = mongoose.model('Account', AccountSchema)
