import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import PostCollection from "../../post/post";
import PostLikeCollection from "../../postLike/postLike";
import UserProfileModel from "../../userProfile/models";
import UserProfileCollection from "../../userProfile/userProfile";
import {
	AvailableCollectionNames,
	MethodUtilMethodsFindCollectionModel,
} from "../models";
import { MongoDBSelector } from "/imports/types/interfaces";
import { internalServerError } from "/imports/utils/serverErrors";

Meteor.methods({
	"utilMethods.findCollection": async function ({
		collection,
		onlyOne,
		selector = {},
		options = {},
		includeDeleted = false,
		count = false,
	}: MethodUtilMethodsFindCollectionModel) {
		const collectionMap = {
			[AvailableCollectionNames.POSTS]: PostCollection,
			[AvailableCollectionNames.POST_LIKES]: PostLikeCollection,
			[AvailableCollectionNames.USER_PROFILE]: UserProfileCollection,
			[AvailableCollectionNames.USERS]: Meteor.users,
		};

		const collectionInstance = collectionMap[collection];

		if (!collectionInstance) {
			return internalServerError("Collection provided does not exist");
		}

		let query: MongoDBSelector = {
			_id: selector,
			$or: [
				{
					deleted: false,
				},
				{
					deleted: {
						$exists: false,
					},
				},
			],
		};

		if (typeof selector === "object") {
			query = {
				$and: [
					{
						...selector,
					},
					{
						$or: [
							{
								deleted: false,
							},
							{
								deleted: {
									$exists: false,
								},
							},
						],
					},
				],
			};
		}

		if (onlyOne) {
			// we specify it as UserProfileModel because TypeScript is just being a big baby an doesn't
			// like to mix user model with the common folk
			const res = await (
				collectionInstance as Mongo.Collection<
					UserProfileModel,
					UserProfileModel
				>
			).findOneAsync(includeDeleted ? selector : query, {
				...options,
				transform: undefined,
			});
			return res;
		}

		if (count) {
			const res = await collectionInstance
				.find(includeDeleted ? selector : query, options)
				.countAsync();
			return res;
		}

		const res = await collectionInstance
			.find(includeDeleted ? selector : query, options)
			.fetchAsync();

		return res;
	},
});
