import { DeleteOutlined, HeartOutlined } from "@ant-design/icons";
import { formatToHumanDate, limitText } from "@netsu/js-utils";
import { Avatar, Button, Card, Popconfirm, Space, Typography } from "antd";
import React from "react";
import { MiniBrowsePagePostModel, MiniBrowsePageUserProfileModel } from "../..";
import { AppUserIdModel } from "/imports/ui/App";

interface PostCardProps {
	post: MiniBrowsePagePostModel;
	userId?: AppUserIdModel;
	postUser: MiniBrowsePageUserProfileModel;
}

const PostCard: React.FC<PostCardProps> = ({ post, userId, postUser }) => {
	const postActions = [
		<Button type="text">
			<HeartOutlined />
		</Button>,
	];

	if (postUser.userId === userId) {
		postActions.push(
			<Popconfirm title="Are you sure you want to DELETE this post?">
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
