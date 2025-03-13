import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { AvailableUserRoles, MethodGetRolesUserRolesModel, ResultGetRolesUserRolesModel } from '../models';

Meteor.methods({
    'get.roles.userRoles': async ({ userIds }: MethodGetRolesUserRolesModel): Promise<ResultGetRolesUserRolesModel> => {
        check(userIds, [String]);

        const res = await Promise.all(
            userIds.map(async (userId) => {
                const roles = await Roles.getRolesForUserAsync(userId);

                return { userId, roles: roles as AvailableUserRoles[] };
            }),
        );

        return { result: res };
    },
});
