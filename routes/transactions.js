var express = require('express')
var router = express.Router()
var Transaction = require('../models/transactions')
var Account = require('../models/accounts')
var auth = require('../middlewares/auth')
var accById = require('../middlewares/getAccById')

router.get('/', function (req, res, next) {
  Transaction.find(function (err, transactions) {
    if (err) return res.status(500).json({error: err})
    res.json(transactions)
  })
})

router.get('/:id', auth.verify, function (req, res, next) {
  Account.findOne({_id: req.params.id})
    .populate('transSend transRecived', 'date amount -_id').exec(function (err, accounts) {
      if (err) return res.status(500).json({error: err})
      if (!accounts) return res.status(404).json({message: 'Account non trovato'})
      res.json(accounts)
    })
})

router.post('/:iban', auth.verify, accById.verifyAcc, function (req, res, next) {
  var transaction = new Transaction()
  transaction.accRecived = req.accRecived._id
  transaction.accSend = req.account._id
  transaction.amount = req.body.amount
  if (req.account.count >= req.body.amount) {
    transaction.save(function (err, transSaved) {
      if (err) return res.status(500).json({message: err})
      req.account.transSend.push(transSaved._id)
      req.account.count = req.account.count - req.body.amount
      req.account.save(function (err, accSaved) {
        if (err) return res.status(500).json({message: err})
        req.accRecived.transRecived.push(transSaved._id)
        req.accRecived.count = req.accRecived.count + req.body.amount
        req.accRecived.save(function (err, accRecivedSaved) {
          if (err) return res.status(500).json({message: err})
          res.status(201).json(transSaved)
        })
      })
    })
  }
})
module.exports = router
