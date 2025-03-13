/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
import PostCollection from '/imports/api/post/post';
import PostLikeCollection from '/imports/api/postLike/postLike';
import SystemChangeLogsCollection from '/imports/api/systemChangeLogs/systemChangeLogs';
import UserProfileCollection from '/imports/api/userProfile/userProfile';

export const denyClientSideDatabaseActions = () => {
    // Deny all client-side updates to user documents (security layer)
    Meteor.users?.deny({
        insert() {
            return true;
        },
        update() {
            return true;
        },
        remove() {
            return true;
        },
    });

    PostCollection.deny({
        insert() {
            return true;
        },
        update() {
            return true;
        },
        remove() {
            return true;
        },
    });

    PostLikeCollection.deny({
        insert() {
            return true;
        },
        update() {
            return true;
        },
        remove() {
            return true;
        },
    });

    SystemChangeLogsCollection.deny({
        insert() {
            return true;
        },
        update() {
            return true;
        },
        remove() {
            return true;
        },
    });

    UserProfileCollection.deny({
        insert() {
            return true;
        },
        update() {
            return true;
        },
        remove() {
            return true;
        },
    });
};
