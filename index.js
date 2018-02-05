const express = require('express')
const app = express()

app.use(express.static('build'))

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan('tiny'))


let persons = [
	{
		"name": "Arto Hellas",
		"number": "040-123456",
		"id": 1
	},
	{
		"name": "Martti Tienari",
		"number": "040-123456",
		"id": 2
	},
	{
		"name": "Arto Järvinen",
		"number": "040-123456",
		"id": 3
	},
	{
		"name": "Lea Kutvonen",
		"number": "040-123456",
		"id": 4
	}
]

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
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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
	if (persons.some(person => person.name === body.name)) {
		return res.status(400).json({error: 'person already exists'})
	}

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})