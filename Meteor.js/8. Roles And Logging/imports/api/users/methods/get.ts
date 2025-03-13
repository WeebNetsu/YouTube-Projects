import { Meteor } from 'meteor/meteor';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    'get.users.current': async () => {
        const user = await currentUserAsync();
        return user;
    },
});
