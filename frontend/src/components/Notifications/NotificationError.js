import React from 'react';

const NotificationError = ({ message }) => {
	if (!message) return;

	return <div className="error">{message}</div>;
};

export default NotificationError;
