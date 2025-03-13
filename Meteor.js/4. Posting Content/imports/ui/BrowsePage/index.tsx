import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useEffect, useState } from "react";
import { BasicSiteProps } from "../App";
import CreatePost from "../components/CreatePost";
import PostCard from "./components/PostCard";
import PostModel from "/imports/api/post/models";
import UserProfileModel from "/imports/api/userProfile/models";
import {
	AvailableCollectionNames,
	MethodUtilMethodsFindCollectionModel,
} from "/imports/api/utils/models";
import { errorResponse } from "/imports/utils/errors";

export interface MiniBrowsePagePostModel
	extends Pick<PostModel, "_id" | "createdAt" | "text" | "userId"> {}

const miniBrowsePagePostFields = {
	_id: 1,
	createdAt: 1,
	text: 1,
	userId: 1,
};

export interface MiniBrowsePageUserProfileModel
	extends Pick<UserProfileModel, "_id" | "username" | "userId" | "photo"> {}

const miniBrowsePageUserProfileFields = {
	_id: 1,
	username: 1,
	userId: 1,
	photo: 1,
};

interface BrowsePageProps extends BasicSiteProps {}

/**
 * This is the general way all fetch data's are defined
 */
export type FetchDataType = (silent?: boolean) => Promise<void>;

const BrowsePage: React.FC<BrowsePageProps> = ({ userId }) => {
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [loading, setLoading] = useState(true);
	const [posts, setPosts] = useState<MiniBrowsePagePostModel[]>([]);
	/**
	 * Note user profiles are filtered based on posts
	 */
	const [userProfiles, setUserProfiles] = useState<
		MiniBrowsePageUserProfileModel[]
	>([]);

	const fetchPosts = async (skip = 0, limit = 10) => {
		try {
			const findData: MethodUtilMethodsFindCollectionModel = {
				collection: AvailableCollectionNames.POSTS,
				selector: {},
				options: {
					fields: miniBrowsePagePostFields,
					limit,
					skip: (skip > 0 ? skip - 1 : skip) * limit,
					sort: { createdAt: -1 },
				},
			};

			const res: MiniBrowsePagePostModel[] = await Meteor.callAsync(
				"utilMethods.findCollection",
				findData
			);

			setPosts(res);

			return res;
		} catch (error) {
			errorResponse(error as Meteor.Error, "Could not get posts");
		}

		return [];
	};

	const fetchPostUsers = async (userIds: string[]) => {
		try {
			const findData: MethodUtilMethodsFindCollectionModel = {
				collection: AvailableCollectionNames.USER_PROFILE,
				selector: {
					userId: {
						$in: userIds,
					},
				},
				options: {
					fields: miniBrowsePageUserProfileFields,
				},
			};

			const res: MiniBrowsePageUserProfileModel[] = await Meteor.callAsync(
				"utilMethods.findCollection",
				findData
			);

			setUserProfiles(res);

			return res;
		} catch (error) {
			errorResponse(error as Meteor.Error, "Could not get users");
		}

		return [];
	};

	const fetchData = async (silent?: boolean) => {
		setLoading(!silent);

		const postRes = await fetchPosts();
		await fetchPostUsers(postRes.map((p) => p.userId));

		setLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) return <LoadingOutlined />;

	return (
		<Space direction="vertical" style={{ width: "100%" }}>
			{showCreatePost ? (
				<CreatePost
					fetchParentData={fetchData}
					show={showCreatePost}
					setShow={setShowCreatePost}
				/>
			) : (
				<Button onClick={() => setShowCreatePost(true)} disabled={!userId}>
					<PlusOutlined /> New Post {!userId && "(Log In To Post)"}
				</Button>
			)}

			{posts.map((post) => {
				const postUser = userProfiles.find((up) => up.userId === post.userId);

				// if we don't know the post user, don't show the post
				if (!postUser) return null;

				return (
					<PostCard
						key={post._id}
						post={post}
						postUser={postUser}
						userId={userId}
					/>
				);
			})}
		</Space>
	);
};

export default BrowsePage;
