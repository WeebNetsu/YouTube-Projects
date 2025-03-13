interface PostModel {
	_id: string;
	/**
	 * User who created this post
	 */
	userId: string;
	text: string;
	createdAt: Date;
	deletedAt?: Date;
	deleted?: boolean;
}

export default PostModel;

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetPostCreateModel {
	text: string;
}

export interface MethodSetPostDeleteModel {
	postId: string;
}
