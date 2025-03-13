import { emailRegex } from '@netsu/js-utils';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import UserProfileCollection from '../../userProfile/userProfile';
import { MethodSetUserCreateModel, UserModel } from '../models';
import { stringContainsOnlyLettersAndNumbers } from '/imports/utils/checks';
import { clientContentError, notFoundError } from '/imports/utils/serverErrors';

Meteor.methods({
    'set.user.create': async function ({ email, password, firstName, lastName, username }: MethodSetUserCreateModel) {
        check(email, String);
        check(password, String);
        check(firstName, String);
        check(lastName, Match.Optional(String));
        check(username, String);

        if (!stringContainsOnlyLettersAndNumbers(username, true)) {
            return clientContentError('Username may only contain letters, numbers and _');
        }

        const cleanedEmail = email.trim();

        if (!emailRegex.test(cleanedEmail)) {
            return clientContentError('Email is invalid');
        }

        if (password.length < 8) {
            return clientContentError('Password is too short');
        }

        const existingUsername = await UserProfileCollection.findOneAsync({ username: `@${username}` });

        if (existingUsername) {
            return clientContentError('This username is already taken');
        }

        await Accounts.createUserAsync({
            email,
            password,
        });

        // ensure the user was created
        const newUser = (await Meteor.users.findOneAsync({ 'emails.address': email })) as UserModel | undefined;
        if (!newUser) return notFoundError('new user');

        // create the users profile
        await UserProfileCollection.insertAsync({
            userId: newUser._id,
            firstName,
            lastName,
            username: `@${username}`,
        });
    },
});
