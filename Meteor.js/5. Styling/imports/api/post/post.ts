import { Mongo } from 'meteor/mongo';
import { AvailableCollectionNames } from '../utils/models';
import PostModel from './models';

const PostCollection = new Mongo.Collection<PostModel>(AvailableCollectionNames.POSTS);

export default PostCollection;
