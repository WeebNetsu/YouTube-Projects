/* eslint-disable import/prefer-default-export */
import { Meteor } from 'meteor/meteor';

export class UserModel implements Meteor.User {
    _id!: string;

    username?: string;

    emails!: Meteor.UserEmail[];

    createdAt!: Date;

    deleted?: boolean;

    /**
     * This will be the profile ID for this user
     */
    profile!: string;

    services?: {
        password: string;
    };
}

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetUserCreateModel {
    email: string;
    password: string;
    firstName: string;
    lastName: string | undefined;
    username: string;
}
