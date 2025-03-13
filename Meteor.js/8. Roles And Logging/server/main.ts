import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { createDefaultUserAccount } from './utils/dummyData';
import { denyClientSideDatabaseActions } from './utils/securityLayer';
import PostLikeCollection from '/imports/api/postLike/postLike';
import { AvailableUserRoles } from '/imports/api/roles/models';
import { UserModel } from '/imports/api/users/models';
import '/imports/startup/imports';

Meteor.startup(async () => {
    console.log('Creating collection indexes');
    PostLikeCollection.rawCollection().createIndex({ postId: 1, userId: 1 });
    console.log('[DONE] Creating collection indexes');

    // Deny all client-side updates to user documents (security layer)
    console.log('Denying all client-side database updates');
    denyClientSideDatabaseActions();

    let defaultUser = await Meteor.users.findOneAsync({ 'emails.address': 'admin@gmail.com' });

    if (!defaultUser) {
        // for development only remove before production
        console.log('Creating default user account');
        await createDefaultUserAccount();

        defaultUser = (await Meteor.users.findOneAsync({ 'emails.address': 'admin@gmail.com' })) as
            | UserModel
            | undefined;

        if (!defaultUser) {
            // if we cannot get the default user, we may have db connection issues
            throw new Error('Could not fetch default user... Were they created?');
        }
        console.log('[DONE] Creating default user account');

        console.log('Creating default site roles');
        await Promise.all(
            Object.values(AvailableUserRoles).map(async (role) => {
                await Roles.createRoleAsync(role);
            }),
        );

        await Roles.addUsersToRolesAsync(defaultUser._id, [AvailableUserRoles.ADMIN, AvailableUserRoles.MODERATOR]);

        console.log('[DONE] Creating default site roles');

        console.log('All default data has been created');
    }

    console.log('Startup complete');
});
