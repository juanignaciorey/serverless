const router = require('express').Router()
const Orders = require('../models/Orders')
const { isAuthenticated, hasRoles } = require('../auth')

router.get('/', (req, res) => {
  Orders.find()
    .exec()
    .then(orders => res.status(200).send(orders))
})

router.get('/:id', (req, res) => {
  Orders.findById(req.params.id)
    .exec()
    .then(order => res.status(200).send(order))
})

router.post('/', isAuthenticated, hasRoles(['user', 'admin']), (req, res) => {
  const { _id } = req.user
  Orders.create({ ...req.body, user_id: _id })
    .then(order => res.status(201).send(order))
})

router.put('/:id', isAuthenticated, hasRoles(['user', 'admin']), (req, res) => {
  const { _id } = req.user
  Orders.findByIdAndUpdate(req.params.id,{ ...req.body, user_id: _id })
    .then(() => res.sendStatus(204))
})

router.delete('/:id', isAuthenticated, hasRoles(['admin']), (req, res) => {
  Orders.findByIdAndDelete(req.params.id)
    .exec()
    .then(() => res.sendStatus(204))
})

module.exports = router