import { CloseOutlined } from "@ant-design/icons";
import { checkStrEmpty } from "@netsu/js-utils";
import { Button, Flex, Input, message, Space } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { FetchDataType } from "../../BrowsePage";
import { MethodSetPostCreateModel } from "/imports/api/post/models";
import { MAX_POST_LENGTH } from "/imports/utils/constants";
import { errorResponse } from "/imports/utils/errors";

interface CreatePostProps {
	show: boolean;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
	fetchParentData: FetchDataType;
}

const CreatePost: React.FC<CreatePostProps> = ({
	fetchParentData,
	show,
	setShow,
}) => {
	const [postText, setPostText] = useState("");

	if (!show) return <></>;

	const handleSubmitPost = async () => {
		if (checkStrEmpty(postText)) return message.error("Post text is required");
		const cleanedText = postText.trim();
		if (cleanedText.length > MAX_POST_LENGTH)
			return message.error("Post text is too long");

		try {
			const data: MethodSetPostCreateModel = {
				text: cleanedText,
			};

			await Meteor.callAsync("set.post.create", data);
		} catch (error) {
			return errorResponse(error as Meteor.Error, "Could not create post");
		}

		message.success("Post Created");
		setPostText("");
		// trigger a refetch of posts
		fetchParentData(true);
		setShow(false);
	};

	return (
		<Flex style={{ width: "100%" }} gap={"large"}>
			<Input.TextArea
				value={postText}
				onChange={(e) => setPostText(e.target.value)}
			/>

			<Space direction="vertical" style={{ alignItems: "center" }}>
				<Button onClick={handleSubmitPost}>Post</Button>
				<Button type="text" onClick={() => setShow(false)}>
					<CloseOutlined />
				</Button>
			</Space>
		</Flex>
	);
};

export default CreatePost;
