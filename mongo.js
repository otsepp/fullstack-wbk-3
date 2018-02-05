const mongoose = require('mongoose')
const url = 'mongodb://<user>:<pass>@ds012058.mlab.com:12058/persons'
mongoose.connect(url)

const Person = mongoose.model('Person', {
	name: String,
	number: String,
})

if (process.argv.length === 4) {
	const name = process.argv[2]
	const number = process.argv[3]
	console.log(`lisätään henkilö ${name} numerolla ${number} luetteloon`)
	
	const person = new Person({
		name: name,
		number: number
	}) 
	
	person.save().then(result => {
		console.log('person saved!')
		mongoose.connection.close()
	})
	
} else {
	console.log('puhelinluettelo')
	Person.find({})
		.then(result => {
			result.forEach(person => {
				console.log(`${person.name} ${person.number}`)
			})
			mongoose.connection.close()
		})
}

