import { Mongo } from "meteor/mongo";

export const MessagesCollection = new Mongo.Collection("messages");

// {
//     _id
//     username
//     message
//     sentAt
// }