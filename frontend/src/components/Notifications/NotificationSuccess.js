import React from 'react';

const NotificationSuccess = ({ message }) => {
	if (!message) return;

	return <div className="success">{message}</div>;
};

export default NotificationSuccess;
