/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';
import { MethodSetUserCreateModel } from '/imports/api/users/models';

export const createDefaultUserAccount = async () => {
    const data: MethodSetUserCreateModel = {
        email: 'admin@gmail.com',
        password: 'password',
        firstName: 'Admin',
        lastName: 'Account',
        username: 'admin',
    };

    await Meteor.callAsync('set.user.create', data);
};
