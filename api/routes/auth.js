const express = require('express')
import crypto from 'cripto'
const jwt = require('jsonwebtoken')
const Users = require('../models/Users')
const { isAuthenticated } = require('../auth')

const router = express.Router()

const signToken = (_id) => {
    return jwt.sign({ _id }, 'mi-secreto', {
        expiresIn: 60 * 60 * 24 * 365,
    })
}

router.post('/register', (req, res) => {
    const {email, password, role} = req.body
  
    crypto.randomBytes (16, (err, rawSalt) => {
      if (err) {
        return res.send ('Error generating random string.')
      }
  
      const salt = rawSalt.toString ('base64')
      crypto.pbkdf2 (password, salt, 10000, 64, 'sha1', (err, key) => {
        if (err) {
          return res.send ('Error generating encrypted key.')
        }
  
        const encryptedPassword = key.toString ('base64')
  
        Users.findOne ({email}).exec ()
          .then (user => {
            if (user) {
              return res.send ('Usuario ya existe.')
            }
  
            Users.create ({
              email,
              password: encryptedPassword,
              role,
              salt
            })
              .then (() => res.send ('usuario creado con éxito.'))
          })
      })
    })
  })

router.post('/login', (req, res) => {
const { email, password } = req.body

Users.findOne({ email }).exec()
    .then(user => {
    if (!user) {
        return res.send ('Usuario y/o contraseña incorrecta.')
    }

    crypto.pbkdf2 (password, user.salt, 10000, 64, 'sha1', (err, key) => {
        if (err) {
        return res.send('')
        }

        const encryptedPassword = key.toString('base64')

        if (user.password === encryptedPassword) {
        const token = signToken(user._id)
        return res.send({ token })
        }

        return res.send('Usuario y/o contraseña incorrecta.')
    })
    })
})

router.get('/me', isAuthenticated, (req, res) => {
    return res.send(req.user)
  })

module.exports = router