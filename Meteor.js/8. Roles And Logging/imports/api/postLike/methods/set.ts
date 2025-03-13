import { limitText } from '@netsu/js-utils';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import PostCollection from '../../post/post';
import { createNewSystemLogSafe } from '../../systemChangeLogs/utils';
import PostLikeModel, { MethodSetPostLikeLikeOrUnlikeModel } from '../models';
import PostLikeCollection from '../postLike';
import { getUserEmail } from '/imports/utils/meteor';
import { noAuthError, notFoundError } from '/imports/utils/serverErrors';
import { currentUserAsync } from '/server/utils/meteor';

Meteor.methods({
    'set.postLike.likeOrUnlike': async ({ postId }: MethodSetPostLikeLikeOrUnlikeModel) => {
        check(postId, String);

        const user = await currentUserAsync();
        if (!user) return noAuthError();

        const post = await PostCollection.findOneAsync(postId);
        if (!post) return notFoundError('post');

        const postLike = (await PostLikeCollection.findOneAsync({
            userId: user._id,
            postId: post._id,
        })) as PostLikeModel | undefined;

        if (postLike) {
            await PostLikeCollection.removeAsync(postLike._id);
        } else {
            await PostLikeCollection.insertAsync({
                userId: user._id,
                postId: post._id,
                createdAt: new Date(),
            });
        }

        await createNewSystemLogSafe({
            subject: `${getUserEmail(user) ?? user._id} has ${postLike ? 'unliked' : 'liked'} a post: ${limitText(post.text)}`,
            update: postLike
                ? `await PostLikeCollection.removeAsync(${postLike._id});`
                : `await PostLikeCollection.insertAsync(${JSON.stringify({
                      userId: user._id,
                      postId: post._id,
                      createdAt: new Date(),
                  })});`,
            method: 'set.postLike.likeOrUnlike',
        });
    },
});
