import React from 'react';
import { useTracker } from "meteor/react-meteor-data";

import { MessagesCollection } from "/imports/db/MessagesCollection";
import Message from "./Message";

function Messages() {
    const { messages, isLoading } = useTracker(() => {
        const noDataAvailible = { messages: [] };
        const handler = Meteor.subscribe("messages");

        if (!handler.ready()) {
            return { ...noDataAvailible, isLoading: true };
        }

        const messages = MessagesCollection.find({}, { sort: { sentAt: -1 } }).fetch();

        return { messages, isLoading: false };
    })

    return (
        <div id="messages-box">
            {isLoading ? (<h2 className="loading">Loading Messages!</h2>) : (
                <>
                    {messages.map(message => <Message key={message._id} username={message.username} message={message.message} />)}
                    <hr />
                    <h6 id="end">END</h6>
                </>
            )}

        </div>
    )
}

export default Messages;