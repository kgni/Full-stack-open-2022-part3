const mongoose = require('mongoose');
require('dotenv').config();

if (process.argv.length < 3) {
	console.log(
		'Please provide the password as an argument: node mongo.js <password>'
	);
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kgni:${password}@fso-phonebook.pfwsuhw.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
	date: Date,
});

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

mongoose
	.connect(url)
	.then((result) => {
		console.log('connected');

		const person = new Person({
			name: name,
			number: number,
			date: new Date(),
		});

		if (!person.name || !person.number) {
			console.log('phonebook:');
			Person.find({}).then((persons) => {
				persons.forEach((person) =>
					console.log(`${person.name} ${person.number}`)
				);
				mongoose.connection.close();
			});
		} else {
			return person.save();
		}
	})
	.then(() => {
		if (name && number) {
			console.log(`added ${name} number ${number} to phonebook`);
			return mongoose.connection.close();
		}
	})
	.catch((err) => console.log(err));
