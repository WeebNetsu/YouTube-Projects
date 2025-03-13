import { checkStrEmpty } from "@netsu/js-utils";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { MethodSetPostCreateModel, MethodSetPostDeleteModel } from "../models";
import PostCollection from "../post";
import { MAX_POST_LENGTH } from "/imports/utils/constants";
import {
	clientContentError,
	noAuthError,
	notFoundError,
} from "/imports/utils/serverErrors";
import { currentUserAsync } from "/server/utils/meteor";

Meteor.methods({
	"set.post.create": async ({ text }: MethodSetPostCreateModel) => {
		check(text, String);

		if (checkStrEmpty(text)) return clientContentError("Post text is required");
		const cleanedText = text.trim();
		if (cleanedText.length > MAX_POST_LENGTH)
			return clientContentError("Post text is too long");

		const user = await currentUserAsync();
		if (!user) return noAuthError();

		await PostCollection.insertAsync({
			createdAt: new Date(),
			text: cleanedText,
			userId: user._id,
		});
	},
	"set.post.delete": async ({ postId }: MethodSetPostDeleteModel) => {
		check(postId, String);

		const user = await currentUserAsync();
		if (!user) return noAuthError();

		const post = await PostCollection.findOneAsync(postId);
		if (!post) return notFoundError("post");

		// mention how you may want to delete user post likes as well
		await PostCollection.updateAsync(postId, {
			$set: {
				deleted: true,
				deletedAt: new Date(),
			},
		});
	},
});
