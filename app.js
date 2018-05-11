var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/fakeBank')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var accounts = require('./routes/accounts')
var transactions = require('./routes/transactions')

app.use('/accounts', accounts)
app.use('/transactions', transactions)

var port = 3001
app.listen(port, () => { console.log('server start at port:', port) })
module.exports = app
