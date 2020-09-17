const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.sendStatus(403)
  }

  jwt.verify(token, 'mi-secreto', (err, decodedToken) => {
    if (err) {
      return res.send('Error verifying token.')
    }

    const { _id } = decodedToken

    Users.findOne({ _id }).exec()
      .then(user => {
        req.user = { _id: user._id, email: user.email, role: user.role }
        next()
      })
  })
}

const hasRoles = roles => (req, res, next) => {
  if (roles.indexOf(req.user.role) === -1) {
    return res.sendStatus(403)
  }

  return next()
}

module.exports = { isAuthenticated, hasRoles }