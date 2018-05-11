var vue = new Vue({
  el: '#app',
  data: {
    currentAccount: null,
    status: 'signup',
    errorMessage: null,
    newAccount: {
      name: '',
      surname: '',
      email: '',
      password: '',
      count: ''
    },
    transaction: null,
    newTrans: {
      amount: '',
      iban: ''
    },
    singleTrans: [],
    accounts: []
  },
  methods: {
    signup: function () {
      this.errorMessage = null
      this.$http.post('http://localhost:3001/accounts/signup', this.newAccount)
        .then(function (response) {
          console.log('response:', response)
        })
        .catch(function (err) {
          this.errorMessage = err.body.message
          console.log(err)
        })
    },
    login: function () {
      this.errorMessage = null
      this.$http.post('http://localhost:3001/accounts/login', {email: this.newAccount.email, password: this.newAccount.password})
        .then(function (response) {
          console.log(response)
          localStorage.setItem('token', response.body.token)
          this.me()
        })
    },
    logout: function () {
      this.currentAccount = null
      localStorage.removeItem('token')
    },
    me: function () {
      this.$http.get(`http://localhost:3001/accounts/me?token=${localStorage.getItem('token')}`)
        .then(function (response) {
          console.log('response:', response)
          this.currentAccount = response.body
        })
    },
    createTransaction: function () {
      this.$http.post(`http://localhost:3001/transactions/${this.newTrans.iban}?token=${localStorage.getItem('token')}`, this.newTrans)
        .then(response => response.json())
        .then(response => {
          console.log('response:', response)
          this.newTrans.amount = ''
          this.transaction = response.body
        })
    },
    getTrans: function (id) {
      this.$http.get(`http://localhost:3001/transactions/${id}?token=${localStorage.getItem('token')}`)
        .then(function (response) {
          console.log('response:', response)
          this.singleTrans = response.body
        })
    },
  },
  created () {
    if (localStorage.getItem('token')) {
      this.me()
    }
  }
})
