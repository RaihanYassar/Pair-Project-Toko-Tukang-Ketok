const express = require('express');
const app = express()
const port = 3000
const session = require('express-session')
const router = require('./routes')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// setup Session dulu
app.use(session({
  secret: 'tukang-ketok-secret-key',
  resave: false,
  saveUninitialized: false,
}))

app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})