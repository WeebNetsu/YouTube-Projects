import React from 'react';

function MessageForm({ onMessageSendHandler, username, setUsername, messageText, setMessageText }) {
    return (
        <form id="message-form" onSubmit={onMessageSendHandler}>
            <input 
                type="text" 
                placeholder="Username" 
                id="username" 
                maxLength={5} 
                autoComplete="off" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input type="text" placeholder="Message" id="message" maxLength={200} autoComplete="off" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
            <input type="submit" value="Send!" id="send-message" />
        </form>
    )
}

export default MessageForm;