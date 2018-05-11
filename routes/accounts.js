var express = require('express')
var router = express.Router()
var Account = require('../models/accounts')
var bcryptjs = require('bcryptjs')
var jwt = require('jwt-simple')
var secret = 'xxx'
var auth = require('../middlewares/auth')

router.get('/', function (req, res, next) {
  Account.find(function (err, accounts) {
    if (err) return res.status(500).json({error: err})
    res.json(accounts)
  })
})

router.get('/me', auth.verify, function (req, res, next) {
  res.json(req.account)
})

router.get('/find/:recived', auth.verify, function (req, res, next) {
  if (req.params.recived === 'recived') {
    Account.find({_id: req.account._id})
      .select('transRecived name surname')
      .populate('transRecived', 'amount date -_id')
      .exec(function (err, transactions) {
        if (err) return res.status(500).json({error: err})
        if (!transactions) return res.status(404).json({message: 'Transaction non trovato'})
        res.json(transactions)
      })
  }
})

router.get('/:send', auth.verify, function (req, res, next) {
  if (req.params.send === 'send') {
    Account.find({_id: req.account._id})
      .select('transSend name surname')
      .populate('transSend', 'amount date -_id')
      .exec(function (err, transactions) {
        if (err) return res.status(500).json({error: err})
        if (!transactions) return res.status(404).json({message: 'Transaction non trovato'})
        res.json(transactions)
      })
  }
})


router.post('/signup', function (req, res, next) {
  var account = new Account(req.body)
  var iban = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 9)
  account.iban = iban.toUpperCase()
  account.password = bcryptjs.hashSync(req.body.password, 10)
  account.save((err) => {
    if (err) return res.status(500).json({message: err})
    res.status(201).json({message: 'Account created'})
  })
})

router.post('/login', function (req, res, next) {
  if (req.body.email === undefined || req.body.password === undefined) {
    return res.status(400).json({message: 'email and password are required'})
  }
  Account.findOne({email: req.body.email}, function (err, account) {
    if (err) return res.status(500).json({message: err})
    if (!account) return res.status(404).json({message: `Account not found with email ${req.body.email}`})
    if (bcryptjs.compareSync(req.body.password, account.password)) {
      return res.json({token: jwt.encode(account._id, secret)})
    } else {
      return res.status(401).json({message: 'password incorrect'})
    }
  })
})

router.put('/password', auth.verify, function (req, res, next) {
  var account = req.account
  account.password = bcryptjs.hashSync(req.body.password, 10)
  account.save(function (err) {
    if (err) return res.status(500).json({error: err})
    res.json(account)
  })
})

router.delete('/:id', auth.verify, function (req, res, next) {
  Account.findOne({_id: req.params.id}, function (err, accounts) {
    if (err) return res.status(500).json({error: err})
    if (!accounts) return res.status(404).json({message: 'Account not find'})
    Account.remove(accounts, function (err) {
      if (err) return res.status(500).json({error: err})
      res.json({message: 'Account deleted'})
    })
  })
})

module.exports = router
