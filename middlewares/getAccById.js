var Account = require('../models/accounts')

var verifyAcc = function (req, res, next) {
  Account.findOne({iban: req.params.iban})
    .exec(function (err, accRecived) {
      if (err) return res.status(500).json({message: err})
      if (!accRecived) return res.status(404).json({message: 'Account not found'})
      req.accRecived = accRecived
      next()
    })
}

module.exports.verifyAcc = verifyAcc
