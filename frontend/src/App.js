import { useEffect, useState } from 'react';
// import axios from 'axios';

// components
import AddPersonForm from './components/AddPersonForm';
import Numbers from './components/Numbers';
import Filter from './components/Filter';
import personService from './services/persons';
import NotificationError from './components/Notifications/NotificationError';
import NotificationSuccess from './components/Notifications/NotificationSuccess';

// styles

import './index.css';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterName, setFilterName] = useState('');
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	// fetching data from our json-server and setting our person state with the data
	useEffect(() => {
		personService.getAll().then((response) => setPersons(response.data));
		// async function getPersons() {
		// 	const response = await axios.get('http://localhost:3001/persons');
		// 	const data = await response.data;
		// 	setPersons(data);
		// 	console.log(data);
		// }
		// getPersons();
	}, []);

	// creating filtering condition. If filterName is empty, then the value is falsy which means we use the entire array of persons.
	// Else we filter the array to contain the names that includes what is in the input.

	const personsToShow = filterName
		? persons.filter((person) =>
				person.name.toLowerCase().includes(filterName.toLowerCase())
		  )
		: persons;

	return (
		<div>
			<h2>Phonebook</h2>
			<NotificationSuccess message={successMessage} />
			<NotificationError message={errorMessage} />

			<Filter
				input={{
					id: 'filter',
					type: 'text',
					value: filterName,
					onChange: (event) => setFilterName(event.target.value),
				}}
			/>

			<AddPersonForm
				setSuccessMessage={setSuccessMessage}
				setErrorMessage={setErrorMessage}
				persons={persons}
				setPersons={setPersons}
				newName={newName}
				setNewName={setNewName}
				newNumber={newNumber}
				setNewNumber={setNewNumber}
			/>
			{/* <div>debug: {newName}</div> */}
			<h2>Numbers</h2>
			<ul>
				{personsToShow.map((person) => (
					<Numbers
						setSuccessMessage={setSuccessMessage}
						setErrorMessage={setErrorMessage}
						setPersons={setPersons}
						key={person.id}
						person={person}
					/>
				))}
			</ul>
		</div>
	);
};

export default App;
