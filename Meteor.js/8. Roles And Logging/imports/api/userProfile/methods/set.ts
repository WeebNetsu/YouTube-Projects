import { checkStrEmpty } from '@netsu/js-utils';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { MethodGetRolesUserRolesModel, ResultGetRolesUserRolesModel } from '../../roles/models';
import { createNewSystemLogSafe } from '../../systemChangeLogs/utils';
import UserProfileModel, {
    MethodSetUserProfileUpdateModel,
    MethodSetUserProfileUpdateProfilePhotoModel,
} from '../models';
import UserProfileCollection from '../userProfile';
import { isModerator, stringContainsOnlyLettersAndNumbers } from '/imports/utils/checks';
import { getUserEmail } from '/imports/utils/meteor';
import { clientContentError, noAuthError, notFoundError } from '/imports/utils/serverErrors';
import { currentUserAsync, getUserByIdAsync } from '/server/utils/meteor';

Meteor.methods({
    'set.userProfile.update': async ({ update, userId }: MethodSetUserProfileUpdateModel) => {
        check(userId, String);
        check(update, Object);

        const allowedFields = new Set(['firstName', 'lastName', 'username']);
        const receivedFields = Object.keys(update);

        const invalidFields = receivedFields.filter((field) => !allowedFields.has(field));

        if (invalidFields.length > 0) return clientContentError('Unexpected fields to update');

        check(update.firstName, Match.Optional(String));
        check(update.lastName, Match.Optional(String));
        check(update.username, Match.Optional(String));

        let cleanedUsername = update.username ? update.username.trim() : undefined;
        const cleanedFirstName = update.firstName ? update.firstName.trim() : undefined;
        const cleanedLastName = update.lastName ? update.lastName.trim() : undefined;

        if (cleanedUsername) {
            if (cleanedUsername[0] === '@') {
                cleanedUsername = cleanedUsername.slice(1);
            }
            if (cleanedUsername.length < 3) return clientContentError('Username is too short');

            if (!stringContainsOnlyLettersAndNumbers(cleanedUsername, true)) {
                return clientContentError('Username may only contain letters, numbers and _');
            }

            cleanedUsername = `@${cleanedUsername}`;

            const existingUser = await UserProfileCollection.findOneAsync({ username: cleanedUsername });
            if (existingUser) return clientContentError('Username is already taken');
        }

        if (cleanedFirstName && checkStrEmpty(cleanedFirstName)) {
            return clientContentError('First name is required');
        }

        const newUpdate: Partial<UserProfileModel> = {
            firstName: cleanedFirstName,
            lastName: cleanedLastName,
            username: cleanedUsername,
        };

        const user = await currentUserAsync();
        if (!user) return noAuthError();

        if (user._id !== userId) {
            const currentUserRoleData: MethodGetRolesUserRolesModel = {
                userIds: [user._id],
            };

            const currentUserRole: ResultGetRolesUserRolesModel = await Meteor.callAsync(
                'get.roles.userRoles',
                currentUserRoleData,
            );

            if (!isModerator(currentUserRole.result.find((r) => r.userId === user._id)?.roles ?? [])) {
                return noAuthError();
            }
        }

        const currentUser = user._id === userId ? user : await getUserByIdAsync(userId);
        if (!currentUser) return notFoundError('user account');

        const originalState = await UserProfileCollection.findOneAsync({ userId });

        await UserProfileCollection.updateAsync(
            { userId },
            {
                $set: newUpdate,
            },
        );

        await createNewSystemLogSafe({
            subject: `${getUserEmail(user) ?? user._id} has updated a user profile ${getUserEmail(currentUser)}`,
            update: `await UserProfileCollection.updateAsync(
            { userId: ${userId} },
            ${JSON.stringify({
                $set: newUpdate,
            })}
            );`,
            method: 'set.userProfile.update',
            previousState: originalState,
        });
    },
    'set.userProfile.updateProfilePhoto': async ({ key, userId }: MethodSetUserProfileUpdateProfilePhotoModel) => {
        check(userId, String);
        check(key, String);

        const user = await currentUserAsync();
        if (!user) return noAuthError();

        if (user._id !== userId) {
            const currentUserRoleData: MethodGetRolesUserRolesModel = {
                userIds: [user._id],
            };

            const currentUserRole: ResultGetRolesUserRolesModel = await Meteor.callAsync(
                'get.roles.userRoles',
                currentUserRoleData,
            );

            if (!isModerator(currentUserRole.result.find((r) => r.userId === user._id)?.roles ?? [])) {
                return noAuthError();
            }
        }

        const currentUser = user._id === userId ? user : await getUserByIdAsync(userId);
        console.log({ userId, key, user, currentUser });
        if (!currentUser) return notFoundError('user account');

        await UserProfileCollection.updateAsync(
            { userId },
            {
                $set: {
                    photo: {
                        key,
                    },
                },
            },
        );

        await createNewSystemLogSafe({
            subject: `${getUserEmail(user) ?? user._id} has updated a user profile photo ${getUserEmail(currentUser)}`,
            update: `await UserProfileCollection.updateAsync(
            { userId: ${userId} },
            ${JSON.stringify({
                $set: {
                    photo: {
                        key,
                    },
                },
            })}
            );`,
            method: 'set.userProfile.updateProfilePhoto',
        });
    },
});
