import { MethodSearchModel } from "/imports/types/interfaces";

export enum AvailableCollectionNames {
	USERS = "users",
	USER_PROFILE = "user_profiles",
}

export interface MethodUtilMethodsFindCollectionModel
	extends MethodSearchModel {
	collection: AvailableCollectionNames;
	/**
	 * If provided, deleted documents will also be provided. If `onlyOne` is used, below will not be used.
	 */
	includeDeleted?: boolean;
	count?: boolean;
}
