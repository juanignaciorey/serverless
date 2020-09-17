const router = require('express').Router()
const { isAuthenticated, hasRoles } = require('../auth')
const Meals = require('../models/Meals')

router.get('/', (req, res) => {
  Meals.find()
    .exec()
    .then(meals => res.status(200).send(meals))
})

router.get('/:id', (req, res) => {
  Meals.findById(req.params.id)
    .exec()
    .then(meal => res.status(200).send(meal))
})

router.post('/', isAuthenticated, (req, res) => {
  Meals.create(req.body)
    .then(meal => res.status(201).send(meal))
})

router.put('/:id', isAuthenticated, (req, res) => {
  Meals.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
})

router.delete('/:id', isAuthenticated, (req, res) => {
  Meals.findByIdAndDelete(req.params.id)
    .exec()
    .then(() => res.sendStatus(204))
})

module.exports = router