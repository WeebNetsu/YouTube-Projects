import React, { useState } from 'react';;

import Header from "./Header";
import MessageForm from "./MessageForm";
import Messages from "./Messages";

function sendMessage(username, text) {
  Meteor.call("messages.send", username, text);
}

function clearChat(username) {
  if(username.trim() == ""){
    alert("Username is required");
    return;
  }

  const clear = confirm("WARNING: This will delete all the messages for you and everyone in the chat. Continue?");

  if (clear) {
    Meteor.call("messages.clear");

    Meteor.call("messages.send", '[BOT]', `All messages were deleted by ${username}`);
  }
}

export const App = () => {
  const [messageText, setMessageText] = useState("");
  const [username, setUsername] = useState("");

  function onMessageSendHandler(e){
    e.preventDefault();

    if(username.trim() == ""){
      alert("Username is required");
      return;
    }else if(messageText.trim() == ""){
      alert("Message is required");
      return;
    }

    sendMessage(username, messageText);
    setMessageText("");
  }

  return (
    <div id="app">
      <Header />

      <MessageForm onMessageSendHandler={onMessageSendHandler} username={username} messageText={messageText} setUsername={setUsername} setMessageText={setMessageText} />

      <Messages />

      <div className="center">
        <button id="clear-chat-btn" onClick={() => clearChat(username)}>Clear Chat</button>
      </div>
    </div>
  )
};
