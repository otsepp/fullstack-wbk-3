const express = require('express')
const app = express()

app.use(express.static('build'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan('tiny'))

const Person = require('./models/person')


const formatPerson = (person) => {	
	return {
		name: person.name,
		number: person.number,
		id: person._id
	}
}


app.get('/api/', (req, res) => {
	res.send('<h2>Puhelinluettelo</h2>')
})

app.get('/api/info', (req, res) => {
	res.send(`
		<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
		<p>${new Date()}</p>
	`)
})

app.get('/api/persons', (req, res) => {
	Person.find({})
		.then(persons => {
			res.json(persons.map(formatPerson))
		})
})

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id)
		.then(person => {
			res.json(formatPerson(person))
		})
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const personExists = () => {
	
	return true
}

app.post('/api/persons', (req, res) => {
	const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'content or number missing'})
  } 

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
		.then(savedPerson => {
			res.json(formatPerson(savedPerson))
		})
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})