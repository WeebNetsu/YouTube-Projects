import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { MethodGetAWSFileFromS3Model } from "../models";
import { internalServerError } from "/imports/utils/serverErrors";
import { downloadFileFromS3 } from "/server/utils/s3";

Meteor.methods({
	"get.aws.fileFromS3": async ({
		key,
	}: MethodGetAWSFileFromS3Model): Promise<string | undefined> => {
		check(key, String);

		try {
			const data = await downloadFileFromS3(key);

			if (!data) return internalServerError("Image data not returned");

			return data;
		} catch (error) {
			console.error(error);
			return internalServerError("Error downloading image");
		}
	},
});
