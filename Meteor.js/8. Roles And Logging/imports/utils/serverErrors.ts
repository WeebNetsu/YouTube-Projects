import { capitalizeFirstLetter } from '@netsu/js-utils';
import { Meteor } from 'meteor/meteor';

/**
 * Throw a `not authorized` Meteor error
 */
export const noAuthError = (msg?: string) => {
    throw new Meteor.Error(401, 'Not Authorized', msg ?? 'You are not authorized to make this change');
};

/**
 * Throws a not found error
 * @param category The category `title` that could not be found
 */
export const notFoundError = (category?: string) => {
    throw new Meteor.Error(
        404,
        'Not Found',
        category ? `${capitalizeFirstLetter(category)} could not be found` : 'Item was not found',
    );
};

/**
 * Throws an internal server error
 * @param msg custom message add to description
 */
export const internalServerError = (msg: string) => {
    throw new Meteor.Error(500, 'Server Error', msg);
};

/**
 * Throws a client error (400)
 * @param msg custom message add to description
 */
export const clientContentError = (msg: string) => {
    throw new Meteor.Error(400, 'Client Error', msg);
};
