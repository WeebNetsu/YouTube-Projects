import React from 'react';

function Message({ username, message }) {
    return (
        <div className="message">
            <p><span className="username">{username}</span>: <span className="message-text">{message}</span></p>
        </div>
    )
}

export default Message;