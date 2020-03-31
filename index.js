
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.post('/subscribe', async (req, res) => {
  const { captcha } = req.body
  if (captcha === null || captcha === undefined || captcha === '') {
    return res.json({
      success: false,
      message: 'Please, select the captcha'
    })
  }

  const secretKey = "6LeUT-QUAAAAAADGa1e6zUorkGrlrSzs0R7-nras"

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`

  const verificationResponse = await axios.post(verifyUrl);

  const { data } = verificationResponse;

  if (!data.success) {
    return res.json({
      success: false,
      errorCode: data['error-codes'],
      message: 'Failed captcha verification'
    })
  }

  console.log(data)

  res.status(200).json({
    success: true,
    message: 'Captcha passed'
  })
})

http.createServer(app).listen(3333, function () {
  console.log('Server started on port 3333')
})