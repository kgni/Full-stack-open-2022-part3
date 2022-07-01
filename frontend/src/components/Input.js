import React from 'react';

const Input = (props) => {
	return (
		<>
			<label htmlFor={props.input.id}>{props.labelText}</label>
			<input {...props.input} />
		</>
	);
};

export default Input;
