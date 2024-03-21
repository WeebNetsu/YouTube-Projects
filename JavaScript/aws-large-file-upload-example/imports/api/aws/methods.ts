import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	S3Client,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { Meteor } from "meteor/meteor";

export const AWS_REGION = "us-east-1";
export const AWS_BUCKET = "yt-tutorial";

const { AWSAccessKeyId, AWSSecretAccessKey } = Meteor.settings;

const s3 = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWSAccessKeyId,
		secretAccessKey: AWSSecretAccessKey,
	},
});

Meteor.methods({
	async createMultiPartUpload(key: string) {
		const multipartUpload = await s3.send(
			new CreateMultipartUploadCommand({
				Bucket: AWS_BUCKET,
				Key: key,
			})
		);

		return multipartUpload;
	},

	async uploadPartS3(
		key: string,
		uploadId: string,
		filePart: Buffer,
		iteration: number
	) {
		const res = await s3.send(
			new UploadPartCommand({
				Bucket: AWS_BUCKET,
				Key: key,
				UploadId: uploadId,
				Body: filePart,
				PartNumber: iteration + 1,
			})
		);

		return res;
	},

	async completeMultiPartUpload(
		key: string,
		uploadId: string,
		uploadResults: any[]
	) {
		const res = await s3.send(
			new CompleteMultipartUploadCommand({
				Bucket: AWS_BUCKET,
				Key: key,
				UploadId: uploadId,
				MultipartUpload: {
					Parts: uploadResults.map(({ ETag }, i) => ({
						ETag,
						PartNumber: i + 1,
					})),
				},
			})
		);

		return res;
	},

	async abortMultiPartUpload(key: string, uploadId: string) {
		const abortCommand = new AbortMultipartUploadCommand({
			Bucket: AWS_BUCKET,
			Key: key,
			UploadId: uploadId,
		});

		await s3.send(abortCommand);
	},
});
