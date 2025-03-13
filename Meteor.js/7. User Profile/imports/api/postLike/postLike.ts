import { Mongo } from 'meteor/mongo';
import { AvailableCollectionNames } from '../utils/models';
import PostLikeModel from './models';

const PostLikeCollection = new Mongo.Collection<PostLikeModel>(AvailableCollectionNames.POST_LIKES);

export default PostLikeCollection;
