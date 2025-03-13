import { Mongo } from 'meteor/mongo';
import { AvailableCollectionNames } from '../utils/models';
import UserProfileModel from './models';

const UserProfileCollection = new Mongo.Collection<UserProfileModel>(AvailableCollectionNames.USER_PROFILE);

export default UserProfileCollection;
