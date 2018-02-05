const mongoose = require('mongoose')
const url = 'mongodb://dev:pass@ds012058.mlab.com:12058/persons'
mongoose.connect(url)

const Person = mongoose.model('Person', {
	name: String,
	number: String,
})

module.exports = Person