import { Meteor } from 'meteor/meteor';
import SystemChangeLogsModel, { MethodSetSystemChangeLogsCreateModel } from '../models';
import SystemChangeLogsCollection from '../systemChangeLogs';
import { noAuthError } from '/imports/utils/serverErrors';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    'set.systemChangeLogs.create': async ({
        subject,
        update,
        note,
        previousState,
    }: MethodSetSystemChangeLogsCreateModel) => {
        const user = await currentUserAsync();

        if (!user) return noAuthError();

        const data: Omit<SystemChangeLogsModel, '_id'> = {
            createdAt: new Date(),
            userId: user._id,
            note,
            subject,
            update,
            previousState: typeof previousState === 'object' ? JSON.stringify(previousState) : previousState,
        };

        await SystemChangeLogsCollection.insertAsync(data);
    },
});
