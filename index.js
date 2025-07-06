require('dotenv').config()
const express = require('express');
const app = express();
var morgan = require('morgan')


app.use(express.static('dist'))
app.use(express.json())
morgan.token('responseString', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :responseString'))


const Person = require('./models/person')

app.get('/api/persons', (request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(note => {
        response.json(note)
    })
    .catch(err => response.status(404).end())
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = Math.floor(Math.random()*10000)
    if(!body.name) {
        return response.status(400).json({ error : "name is not included" })
    }
    if(!body.number) {
        return response.status(400).json({ error : "number is not included" })
    }
    if(persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error : "name must be unique" })
    }
    const person = {
        id : id,
        name : body.name,
        number: body.number
    }
    persons = persons.concat(person)
    
    response.json(person)
})

app.get('/info', (request, response) => {
    const message = `<p>Phonebook has info for 2 people</p>
        <p>${new Date().toString()}</p>`
    response.send(message)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})