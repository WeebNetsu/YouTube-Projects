import { DeleteOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { formatToHumanDate, limitText } from "@netsu/js-utils";
import {
	Avatar,
	Button,
	Card,
	message,
	Popconfirm,
	Space,
	Typography,
} from "antd";
import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React, { useMemo } from "react";
import {
	FetchDataType,
	MiniBrowsePagePostModel,
	MiniBrowsePageUserProfileModel,
} from "../..";
import PostModel, { MethodSetPostDeleteModel } from "/imports/api/post/models";
import {
	MethodPublishPostLikeTotalLikesModel,
	MethodPublishPostLikeUserLikedModel,
	MethodSetPostLikeLikeOrUnlikeModel,
} from "/imports/api/postLike/models";
import PostLikeCollection from "/imports/api/postLike/postLike";
import { AppUserIdModel } from "/imports/ui/App";
import { errorResponse } from "/imports/utils/errors";

interface PostCardProps {
	post: MiniBrowsePagePostModel;
	userId?: AppUserIdModel;
	postUser: MiniBrowsePageUserProfileModel;
	fetchParentData: FetchDataType;
}

const PostCard: React.FC<PostCardProps> = ({
	post,
	userId,
	postUser,
	fetchParentData,
}) => {
	const loadingLikes = useTracker(() => {
		const totalLikeData: MethodPublishPostLikeTotalLikesModel = {
			postId: post._id,
		};
		const loadingTotalLikes = Meteor.subscribe(
			"publish.postLike.totalLikes",
			totalLikeData
		);

		let loadingUserLike: Meteor.SubscriptionHandle | undefined;
		if (userId) {
			const userLikeData: MethodPublishPostLikeUserLikedModel = {
				postId: post._id,
				userId,
			};
			loadingUserLike = Meteor.subscribe(
				"publish.postLike.userLiked",
				userLikeData
			);
		}

		return !(loadingUserLike?.ready() ?? true) || !loadingTotalLikes.ready();
	}, [post._id]);

	const postLikes: number | undefined = useTracker(() => {
		const res = PostLikeCollection.find({ postId: post._id }).count();
		return res;
	}, [post._id]);
	const userLike: Partial<PostModel> | undefined = useTracker(
		() => PostLikeCollection.find({ postId: post._id, userId }).count(),
		[post._id, userId]
	);

	const handleLikeOrUnlikePost = useMemo(
		() =>
			_.debounce(async () => {
				if (!userId) {
					return message.info("You need to login to like posts");
				}

				try {
					const data: MethodSetPostLikeLikeOrUnlikeModel = {
						postId: post._id,
					};

					await Meteor.callAsync("set.postLike.likeOrUnlike", data);
				} catch (error) {
					errorResponse(error as Meteor.Error, "Could not like or unlike post");
				}
			}, 1000),
		[]
	);

	const handleDeletePost = async () => {
		try {
			const data: MethodSetPostDeleteModel = {
				postId: post._id,
			};

			await Meteor.callAsync("set.post.delete", data);

			message.success("Post Deleted");
			fetchParentData(true);
		} catch (error) {
			errorResponse(error as Meteor.Error, "Could not delete post");
		}
	};

	const postActions = [
		<Button type="text" onClick={handleLikeOrUnlikePost}>
			{loadingLikes ? (
				<HeartOutlined />
			) : (
				<>
					{postLikes ?? ""}{" "}
					{userLike ? (
						<HeartFilled style={{ color: "red" }} />
					) : (
						<HeartOutlined />
					)}
				</>
			)}
		</Button>,
	];

	if (postUser.userId === userId) {
		postActions.push(
			<Popconfirm
				title="Are you sure you want to DELETE this post?"
				onConfirm={handleDeletePost}
			>
				<Button type="text" danger>
					<DeleteOutlined />
				</Button>
			</Popconfirm>
		);
	}

	return (
		<Card key={post._id} actions={postActions} style={{ minWidth: 300 }}>
			<Card.Meta
				avatar={
					<Avatar
						style={{ backgroundColor: "#ff98ad", verticalAlign: "middle" }}
						size="large"
						gap={4}
					>
						{limitText(postUser.username, 7)}
					</Avatar>
				}
				description={
					<Space direction="vertical">
						<Typography>{post.text}</Typography>
						<Typography>
							{formatToHumanDate(post.createdAt)} By{" "}
							<Button type="link">{postUser.username}</Button>
						</Typography>
					</Space>
				}
			/>
		</Card>
	);
};

export default PostCard;
