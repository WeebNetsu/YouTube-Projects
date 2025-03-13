import { Meteor } from 'meteor/meteor';
import UserProfileModel from '../models';
import UserProfileCollection from '../userProfile';
import { noAuthError } from '/imports/utils/serverErrors';

Meteor.methods({
    'get.userProfiles.current': async (): Promise<UserProfileModel | undefined> => {
        const userId = Meteor.userId();
        if (!userId) return noAuthError('User not logged in');

        const userProfile = await UserProfileCollection.findOneAsync({ userId });
        return userProfile;
    },
});
