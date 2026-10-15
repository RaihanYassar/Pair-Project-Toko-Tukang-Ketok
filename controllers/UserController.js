const { User, UserProfile } = require('../models/index')
const bcrypt = require('bcryptjs')


class UserController {
  static async home(req, res) {
    try {
      res.render('login/home')
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async getLoginPage(req, res) {
    try {
      const { error } = req.query
      res.render('login/login', { error })
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async postLoginPage(req, res) {
    try {
      const { email, password } = req.body
      
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.redirect('/login?error=Email atau password salah bree hadehhh..')
      }

      const isValidPassword = bcrypt.compareSync(password, user.password)
      if (!isValidPassword) {
        return res.redirect('/login?error=Email atau password salah bree hadehhh..')
      }

      // mensetting session
      req.session.user = {
        id: user.id,
        userName: user.userName,
        role: user.role
      };

      res.redirect('/products')
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async getRegisterPage(req, res) {
    try {
      const { errors } = req.query
      res.render('login/register', { errors })
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  static async postRegisterPage(req, res) {
    try {
      const { userName, email, password, role, firstName, lastName, phoneNum, address } = req.body

      const newProfile = await UserProfile.create({
        firstName, lastName, phoneNum, address
      });

      await User.create({
        userName,
        email,
        password,
        role,
        UserProfilesId: newProfile.id
      });

      res.redirect('/login')
    } catch (error) {
      if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        let errors = error.errors.map(err => err.message)
        return res.redirect(`/register?errors=${errors}`)
      }
      console.log(error)
      res.send(error.message)
    }
  }

  static async getLogout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err)
        return res.send(err.message)
      }
      
      res.clearCookie('connect.sid')
      
      return res.redirect('/login')
    })
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}
}

module.exports = UserController