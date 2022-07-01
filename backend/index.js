const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
// const requestLogger = require('./middleware/requestLogger');
const unknownEndpoint = require('./middleware/unknownEndpoint');
let data = require('./data');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', function (req, res) {
	return [JSON.stringify(req.body)];
});
// app.use(requestLogger);

app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
// GET
app.get('/api/persons', (req, res) => {
	res.json(data);
});
app.get('/info', (req, res) => {
	res.send(
		`<p>Phonebook has info for ${data.length} people</p> <p> ${new Date()}</p>`
	);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = data.find((person) => person.id === id);
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

// POST

const generateId = () => {
	return Math.floor(Math.random() * 999999999999999999999);
};

app.post('/api/persons', (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		res.status(400).json({ error: 'name or number is missing' });
		return;
	}

	if (
		data.find((person) => person.name.toLowerCase() === body.name.toLowerCase())
	) {
		res.status(400).json({ error: 'name already exists' });
		return;
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	data = data.concat(person);

	res.status(200).json(person);
});

// DELETE

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = data.find((person) => person.id === id);
	if (person) {
		data = data.filter((person) => person.id !== id);
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

// middleware if a request was made to an unknown route
app.use(unknownEndpoint);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
