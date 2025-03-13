import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { createNewSystemLogSafe } from '../../systemChangeLogs/utils';
import {
    AvailableUserRoles,
    MethodGetRolesUserRolesModel,
    MethodSetRolesUpdateUserRolesModel,
    ResultGetRolesUserRolesModel,
} from '../models';
import { getUserEmail } from '/imports/utils/meteor';
import { noAuthError } from '/imports/utils/serverErrors';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    'set.roles.updateUserRoles': async function ({ role, users, removeRole }: MethodSetRolesUpdateUserRolesModel) {
        check(users, [String]);

        const currentUser = await currentUserAsync();
        if (!currentUser) return noAuthError();

        const currentUserRoleData: MethodGetRolesUserRolesModel = {
            userIds: users,
        };

        const currentUserRole: ResultGetRolesUserRolesModel = await Meteor.callAsync(
            'get.roles.userRoles',
            currentUserRoleData,
        );

        if (!currentUserRole.result.find((r) => r.roles.includes(AvailableUserRoles.ADMIN))) {
            // only admins can apply roles to users
            return noAuthError();
        }

        const data: MethodGetRolesUserRolesModel = {
            userIds: users,
        };

        const res: ResultGetRolesUserRolesModel = await Meteor.callAsync('get.roles.userRoles', data);

        if (removeRole) {
            if (res.result.find((r) => r.roles.includes(AvailableUserRoles.ADMIN))) {
                // an admins role cannot be revoked
                return noAuthError();
            }

            await Roles.removeUsersFromRolesAsync(users, [role]);

            await createNewSystemLogSafe({
                subject: `${getUserEmail(currentUser) ?? currentUser._id} has removed users from role ${role}: ${JSON.stringify(users)}`,
                update: `await Roles.removeUsersFromRolesAsync(${JSON.stringify(users)}, [${role}]);`,
                method: 'set.roles.updateUserRoles',
            });
        } else {
            await Roles.addUsersToRolesAsync(users, [role]);

            await createNewSystemLogSafe({
                subject: `${getUserEmail(currentUser) ?? currentUser._id} has added users to role ${role}: ${JSON.stringify(users)}`,
                update: `await Roles.addUsersToRolesAsync(${JSON.stringify(users)}, [${role}]);`,
                method: 'set.roles.updateUserRoles',
            });
        }
    },
});
