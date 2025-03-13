import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import {
    MethodSetAwsDeleteFileModel,
    MethodSetAwsDeleteMultipleFilesModel,
    MethodSetAwsUploadFileModel,
} from '../models';
import { deleteFileFromS3, uploadFileToS3 } from '/server/utils/s3';

Meteor.methods({
    'set.aws.uploadFile': async function ({ key, buffer, contentType }: MethodSetAwsUploadFileModel) {
        check(key, String);
        check(buffer, String);
        check(contentType, String);

        const res = await uploadFileToS3(key, buffer, contentType);
        return res;
    },
    'set.aws.deleteFile': async function ({ key }: MethodSetAwsDeleteFileModel) {
        check(key, String);

        const res = await deleteFileFromS3(key);
        return res;
    },
    'set.aws.deleteMultipleFiles': async function ({ keys }: MethodSetAwsDeleteMultipleFilesModel) {
        check(keys, [String]);

        const prom = keys.map(async (key) => {
            try {
                const res = await deleteFileFromS3(key);
                return res;
            } catch (error) {
                // rather not break out of this loop
                // todo maybe send email to dev to notify it failed?
                console.error('Failed to upload', key);
            }
        });

        const res = await Promise.all(prom);

        return res;
    },
});
