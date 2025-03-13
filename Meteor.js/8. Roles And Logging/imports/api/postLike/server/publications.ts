import { Meteor } from 'meteor/meteor';
import { MethodPublishPostLikeTotalLikesModel, MethodPublishPostLikeUserLikedModel } from '../models';
import PostLikeCollection from '../postLike';

if (Meteor.isServer) {
    Meteor.publish('publish.postLike.totalLikes', ({ postId }: MethodPublishPostLikeTotalLikesModel) => {
        // limit fields to reduce data during heavy load
        // not if you use fields: { _id: 1 } it will not return the data you want
        // weird meteor behavior where you need to specify the field you use for filtering as the return field
        // if you don't just want to return all the data at once
        return PostLikeCollection.find({ postId }, { fields: { postId: 1 } });
    });
    Meteor.publish('publish.postLike.userLiked', ({ postId, userId }: MethodPublishPostLikeUserLikedModel) => {
        // limit fields to reduce data during heavy load
        // not if you use fields: { _id: 1 } it will not return the data you want
        // weird meteor behavior where you need to specify the field you use for filtering as the return field
        // if you don't just want to return all the data at once
        return PostLikeCollection.find({ postId, userId }, { fields: { postId: 1, userId: 1 } });
    });
}
