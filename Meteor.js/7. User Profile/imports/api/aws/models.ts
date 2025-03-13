export interface MethodSetAwsUploadFileModel {
    key: string;
    /**
     * Should be base64 for image
     */
    buffer: string;
    contentType: string;
}

export interface MethodSetAwsDeleteFileModel {
    key: string;
}

export interface MethodSetAwsDeleteMultipleFilesModel {
    keys: string[];
}

export interface MethodGetAWSFileFromS3Model {
    key: string;
}
