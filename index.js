const express = require('express');
const app = express();
var morgan = require('morgan')

app.use(express.json())
morgan.token('responseString', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :responseString'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((person) => person.id === id)
    if(person) {
        response.json(person)
    } else {
        response.statusMessage = "Resource not found"
        response.status(404).end()
    }
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