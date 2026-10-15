const express = require('express');
const app = express()
const port = 3000
const session = require('express-session')
const router = require('./routes')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Setup Session (Requirement auth)
app.use(session({
  secret: 'tukang-ketok-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use('/', router)

app.listen(port, () => {
  console.log(`Server Tukang Ketok nyala udah nyala nich, di port ${port} yaa bree!!`)
})