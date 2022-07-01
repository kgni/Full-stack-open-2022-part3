import React from 'react';
import personService from '../services/persons';

const Numbers = ({
	setPersons,
	person,
	setErrorMessage,
	setSuccessMessage,
}) => {
	const deleteHandler = () => {
		window.confirm(`Delete ${person.name} ?`);

		personService
			.deletePerson(person.id)
			.then((response) => {
				setPersons((prevPersons) =>
					prevPersons.filter((prevPerson) => prevPerson.id !== person.id)
				);

				setSuccessMessage(`${person.name} was successfully deleted`);

				setTimeout(() => {
					setSuccessMessage(null);
				}, 5000);
			})
			.catch((error) => {
				setErrorMessage(
					`Information of ${person.name} has already been removed from the server`
				);

				setTimeout(() => {
					setErrorMessage(null);
				}, 5000);
			});
		setPersons((prevPersons) =>
			prevPersons.filter((prevPerson) => prevPerson.id !== person.id)
		);
	};
	return (
		<li>
			{person.name} - {person.number}{' '}
			<button onClick={deleteHandler}>delete</button>
		</li>
	);
};

export default Numbers;
