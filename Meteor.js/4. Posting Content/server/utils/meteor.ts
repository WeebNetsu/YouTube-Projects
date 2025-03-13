/* eslint-disable import/prefer-default-export */

import { Meteor } from "meteor/meteor";
import { UserModel } from "/imports/api/users/models";

/**
 * This will find a user by their ID, equivalent to
 * `Meteor.users.findOne(userId) as unknown as UserModel | undefined`
 *
 * @note **SERVER ONLY**
 *
 * @param userId ID of user to find
 * @returns user
 */
export const getUserByIdAsync = async (userId: string) => {
	return (await Meteor.users.findOneAsync(userId)) as unknown as
		| UserModel
		| undefined;
};

/**
 * Get the current user (Meteor.user() equivalent)
 *
 * @meteor users.get.current
 *
 * @note **SERVER ONLY** (get.users.current method for client)
 *
 * @returns The current user
 */
export const currentUserAsync = async () => {
	return (await Meteor.userAsync()) as unknown as UserModel | undefined;
};
