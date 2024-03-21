import { CreateMultipartUploadCommandOutput } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import React, { useState } from "react";

export const App: React.FC = () => {
	const [fileUploadProgress, setFileUploadProgress] = useState<
		null | undefined | string
	>(undefined);
	const [result, setResult] = useState<any>();

	const handleUploadFile = async (file: File) => {
		setFileUploadProgress(null);

		const key = `${Random.id()}.${_.last(file.name.split("."))}`;

		const multipartUpload: CreateMultipartUploadCommandOutput =
			await Meteor.callAsync("createMultiPartUpload", key);

		const uploadId = multipartUpload.UploadId;

		const uploadPromises = [];

		// Multipart uploads require a minimum size of 5 MB per part.
		// split into 10mb parts
		let partSize = 10 * 1024 * 1024; // *1024 = convert to bytes

		const totalParts = Math.ceil(file.size / partSize);

		// Upload each part.
		try {
			let partCount = 0;

			const executeAndPrint = async (
				buffer: Buffer,
				iteration: number,
				runCount = 0
			) => {
				try {
					const res = await Meteor.callAsync(
						"uploadPartS3",
						key,
						uploadId,
						buffer,
						iteration
					);

					setFileUploadProgress(
						(((iteration + 1) / totalParts) * 100).toFixed(2)
					);

					return res;
				} catch (error) {
					if (runCount > 5) {
						console.error("Item", iteration, "completely failed to upload");
						return;
					}

					console.warn(error);

					const res: any = await executeAndPrint(
						buffer,
						iteration,
						runCount + 1
					);
					return res;
				}
			};

			do {
				const start = partCount * partSize;
				const end = start + partSize;
				const filePart = file.slice(start, end);

				if (filePart.size < 1) break;

				const arrBuf = await filePart.arrayBuffer();
				const buffer = Buffer.from(arrBuf);

				const res = await executeAndPrint(buffer, partCount);

				uploadPromises.push(res);

				partCount++;
			} while (true);

			const res = await Meteor.callAsync(
				"completeMultiPartUpload",
				key,
				uploadId,
				uploadPromises
			);

			setResult(res);

			return res;
		} catch (err) {
			console.error(err);

			if (uploadId) {
				await Meteor.callAsync("abortMultiPartUpload", key, uploadId);
			}
		}
	};

	return (
		<div>
			<h1>Welcome to Meteor!</h1>

			{fileUploadProgress !== undefined && (
				<p>
					File Upload Progress:{" "}
					{fileUploadProgress === null
						? "Starting upload"
						: `${fileUploadProgress}%`}
				</p>
			)}

			<input
				type="file"
				onChange={(e) => {
					handleUploadFile(_.first(e.target.files)!);
				}}
			/>

			{result && (
				<p>
					file link: <a href={result.Location}>click me</a>{" "}
				</p>
			)}
		</div>
	);
};
