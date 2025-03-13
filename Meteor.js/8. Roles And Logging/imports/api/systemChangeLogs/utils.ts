/* eslint-disable import/prefer-default-export */

import { Meteor } from 'meteor/meteor';
import { MethodSetSystemChangeLogsCreateModel } from './models';

export interface CreateNewSystemLogSafeModel extends MethodSetSystemChangeLogsCreateModel {
    /**
     * The meteor method call used
     */
    method: string;
}

/**
 * Creates a new system log
 *
 * @note SERVER ONLY
 *
 * @safe will not throw an error, so does not need a try/catch
 */
export const createNewSystemLogSafe = async (data: CreateNewSystemLogSafeModel) => {
    try {
        await Meteor.callAsync('set.systemChangeLogs.create', data);
    } catch (error) {
        console.error(error);
        // do nothing - should we notify the user logging failed?
    }
};
