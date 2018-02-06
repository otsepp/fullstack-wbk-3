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
	Person.find({})
		.then(persons => {
			res.send(`
				<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
				<p>${new Date()}</p>
			`)
		})
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
		.catch(error => {
			res.status(400).end()
		})
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => {
			res.status(400).send({error: 'malformatted id'})
		})
})

app.post('/api/persons', (req, res) => {
	const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'content or number missing'})
  } 
	
  const person = new Person({
    name: body.name,
    number: body.number,
  })

	Person.find({name: person.name})
		.then(result => {
			if (!result.length) {
				return person.save()
			} 
		})
		.then(savedPerson => {
			if (savedPerson !== undefined)
				res.json(formatPerson(savedPerson))
			else
				res.status(400).send({error: 'person by name exists'})
		}) 
	
	/*
  person.save()
		.then(savedPerson => {
			res.json(formatPerson(savedPerson))
		}) */
})

app.put('/api/persons/:id', (req, res) => {
	const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }
	
  Person
    .findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(updatedPerson => {
      res.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})