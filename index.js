const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
// const requestLogger = require('./middleware/requestLogger');
const unknownEndpoint = require('./middleware/unknownEndpoint');

// models

const Person = require('./models/person');

// HARDCODED DATA:
// let data = require('./data');

mongoose.connect(process.env.MONGO_URI).then(() => {
	console.log('Connected to DB');
	const PORT = process.env.PORT;
	app.listen(PORT, () => {
		console.log(`server running on port ${PORT}`);
	});
});

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', function (req) {
	return [JSON.stringify(req.body)];
});
// app.use(requestLogger);

app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
// GET
app.get('/api/persons', (req, res) => {
	Person.find({}).then((persons) => {
		res.json(persons);
	});
});
app.get('/info', async (req, res) => {
	const persons = await Person.find({});
	res.send(
		`<p>Phonebook has info for ${
			persons.length
		} people</p> <p> ${new Date()}</p>`
	);
});

app.get('/api/persons/:id', (req, res) => {
	const { id } = req.params;

	// check if the provided ID, is following the rules for how an ID should be in mongo
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.status(400).json({ error: 'not a valid id' });
		return;
	}

	Person.findById(id)
		.then((result) => {
			// if we had a correct ID (following the rules by the ObjectId.isValid method, we will send back the result)
			if (result) {
				res.json(result);
				// if mongoose couldn't find a document with the provided ID, it will return null which is falsy, and therefor we can send back an error message.
			} else {
				res.json({ error: 'no person found' });
			}
		})
		.catch(() => res.status(404));
});

// POST

app.post('/api/persons', (req, res, next) => {
	const body = req.body;

	if (!body.name || !body.number) {
		res.status(400).json({ error: 'name or number is missing' });
		return;
	}

	Person.create({ name: body.name, number: body.number })
		.then((result) => res.status(200).json(result))
		.catch((error) => next(error));
});

// DELETE

app.delete('/api/persons/:id', (req, res) => {
	const { id } = req.params;

	// check if the provided ID, is following the rules for how an ID should be in mongo
	if (!mongoose.Types.ObjectId.isValid(id)) {
		res.status(400).json({ error: 'not a valid id' });
		return;
	}

	Person.findByIdAndDelete(id).then((result) => {
		if (result) {
			res.status(200).json(result);
		} else {
			res.json({ error: 'no person found' });
		}
	});
});

// UPDATE

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, {
		new: true,
		runValidators: true,
	})
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

// middleware if a request was made to an unknown route
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

// handler of requests with result to errors
app.use(errorHandler);
