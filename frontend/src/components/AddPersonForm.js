import React from 'react';
import Input from './Input';
import personService from '../services/persons';
const AddPersonForm = ({
	persons,
	setPersons,
	newName,
	setNewName,
	newNumber,
	setNewNumber,
	setSuccessMessage,
	setErrorMessage,
}) => {
	const addPersonHandler = (event) => {
		event.preventDefault();

		// if any field is empty, alert the user:

		if (newName.trim() === '' || newNumber.trim() === '') {
			alert(`Fields cannot be empty`);
			return;
		}

		// parse newNumber from string to a number:

		const number = newNumber;

		// check if number is a number

		// create array of only the names and numbers in our phonebook lower casing all names so we cannot add the same name with different casing)
		const names = persons.map((person) => person.name.toLowerCase());
		const numbers = persons.map((person) => person.number);

		// check if name is already in the list. If it is we alert and return to stop execution of the function
		if (names.includes(newName.toLowerCase()) && !numbers.includes(number)) {
			if (
				window.confirm(
					`${newName} is already added to the phonebook, replace the old number with a new one?`
				)
			) {
				let updatedPerson = persons.find((person) => person.name === newName);
				const oldNumber = updatedPerson.number;
				updatedPerson.number = number;

				personService
					.update(updatedPerson.id, updatedPerson)
					.then((result) => {
						setPersons((prevPersons) =>
							prevPersons.map((person) =>
								person.id !== updatedPerson.id ? person : updatedPerson
							)
						);
						setSuccessMessage(
							`${newName}'s number was changed from ${oldNumber} to ${number}`
						);

						setTimeout(() => {
							setSuccessMessage(null);
						}, 5000);

						setNewName('');
						setNewNumber('');
						return;
					})
					.catch((error) => {
						console.log(error.response.data);

						setErrorMessage(error.response.data.error);

						setTimeout(() => {
							setErrorMessage(null);
						}, 5000);
						return;
					});
			}
		}

		if (numbers.includes(number)) {
			alert(`${number} is already added to the phonebook`);
			return;
		}

		const personObject = {
			name: newName,
			number: number,
		};

		personService
			.create(personObject)
			.then((response) => {
				setPersons((prevPersons) => {
					return [...prevPersons, response.data];
				});

				setSuccessMessage(`Added ${newName}`);

				setTimeout(() => {
					setSuccessMessage(null);
				}, 5000);

				console.log(`${newName} - ${number} was added to the phonebook`);

				setNewName('');
				setNewNumber('');
			})
			.catch((error) => {
				console.log(error.response.data);

				setErrorMessage(error.response.data.error);

				setTimeout(() => {
					setErrorMessage(null);
				}, 5000);
			});
	};

	return (
		<form onSubmit={addPersonHandler}>
			<h3>add a new</h3>
			<div>
				<Input
					labelText="name:"
					input={{
						id: 'name',
						type: 'text',
						value: newName,
						onChange: (event) => setNewName(event.target.value),
					}}
				/>
				<Input
					labelText="number"
					input={{
						id: 'number',
						type: 'text',
						value: newNumber,
						onChange: (event) => setNewNumber(event.target.value),
					}}
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

export default AddPersonForm;
