const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give at leat password')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://felisuco146:${password}@cluster0.7p1ce53.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name : String,
    number : String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log("phoneBook:")
        result.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name : process.argv[3],
        number : process.argv[4],
    })

    person.save().then(() => {
        console.log(`added ${process.argv[3]} ${process.argv[4]}`)
        mongoose.connection.close()
    })
}