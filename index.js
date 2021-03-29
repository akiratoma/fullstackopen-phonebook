require('dotenv').config()

const express = require('express')

const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./server/models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
  tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : '',
].join(' ')))

app.get('/health', (_req, res) => {
  res.send('ok')
})

app.get('/api/persons', (_, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((err) => next(err))
})

app.get('/api/info', (_, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.set('Content-Type', 'text/plain')
      res.send(`Phonebook has info for ${count} people\n\n${new Date()}`)
    })
    .catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const { name } = req.body
  const { number } = req.body
  if (!name) {
    res.status(400)
    res.json({ error: 'name is missing' })
  } else if (!number) {
    res.status(400)
    res.json({ error: 'number is missing' })
  } else {
    const person = new Person({ name, number })
    person.save()
      .then((savedPerson) => {
        res.json(savedPerson)
      })
      .catch((err) => next(err))
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name } = req.body
  const { number } = req.body
  const person = { name, number }
  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// eslint-disable-next-line consistent-return
const errorHandler = (err, _, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const port = process.env.PORT || 3001

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`)
})
