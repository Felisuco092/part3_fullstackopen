require('dotenv').config()
const express = require('express');
const app = express();
var morgan = require('morgan')


app.use(express.static('dist'))
app.use(express.json())
morgan.token('responseString', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :responseString'))


const Person = require('./models/person')

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(notes => {
        response.json(notes)
    }).catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(note => {
        if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(deletedResource => {
        response.status(201).json(deletedResource)
    })
    .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if(!body.name) {
        return response.status(400).json({ error : "name is not included" })
    }
    if(!body.number) {
        return response.status(400).json({ error : "number is not included" })
    }
    
    const person = new Person({
        name:body.name,
        number:body.number,
    })

    person.save().then(savedPerson => response.json(savedPerson))
    .catch(err => next(err))
})

app.get('/info', (request, response) => {
    const message = `<p>Phonebook has info for 2 people</p>
        <p>${new Date().toString()}</p>`
    response.send(message)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  return response.status(404).end()
}


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})