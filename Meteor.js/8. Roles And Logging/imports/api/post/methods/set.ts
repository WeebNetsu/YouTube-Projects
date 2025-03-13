import { checkStrEmpty, limitText } from "@netsu/js-utils";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { createNewSystemLogSafe } from "../../systemChangeLogs/utils";
import { MethodSetPostCreateModel, MethodSetPostDeleteModel } from "../models";
import PostCollection from "../post";
import { MAX_POST_LENGTH } from "/imports/utils/constants";
import { getUserEmail } from "/imports/utils/meteor";
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

		await createNewSystemLogSafe({
			subject: `${
				getUserEmail(user) ?? user._id
			} has created a post: ${limitText(text)}`,
			update: `await PostCollection.insertAsync(${JSON.stringify({
				createdAt: new Date(),
				text: cleanedText,
				userId: user._id,
			})});`,
			method: "set.post.create",
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

		await createNewSystemLogSafe({
			subject: `${
				getUserEmail(user) ?? user._id
			} has deleted a post: ${limitText(post.text)} (${post._id})`,
			update: `await PostCollection.updateAsync(${postId}, ${JSON.stringify({
				$set: {
					deleted: true,
					deletedAt: new Date(),
				},
			})});`,
			method: "set.post.delete",
			previousState: post,
		});
	},
});
