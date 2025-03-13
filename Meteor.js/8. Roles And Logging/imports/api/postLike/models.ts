interface PostLikeModel {
    _id: string;
    /**
     * User who liked the post
     */
    userId: string;
    postId: string;
    createdAt: Date;
}

export default PostLikeModel;

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetPostLikeLikeOrUnlikeModel {
    postId: string;
}

// ---- PUBLICATION METHOD MODELS ----
export interface MethodPublishPostLikeTotalLikesModel {
    postId: string;
}

export interface MethodPublishPostLikeUserLikedModel {
    postId: string;
    userId: string;
}
