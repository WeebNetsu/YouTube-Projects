export interface PhotoModel {
    key: string;
    // you can save other information here like file type and size
}

interface UserProfileModel {
    _id: string;
    /**
     * User this profile is linked to
     */
    userId: string;
    /**
     * The first name of the user
     */
    firstName: string;
    /**
     * The last name of the user
     */
    lastName?: string;
    /**
     * There is a username field on the user model itself, but this feels more useful since we'll almost always
     * access the user profile instead of user account
     */
    username: string;
    photo?: PhotoModel;
}

export default UserProfileModel;

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetUserProfileUpdateModel {
    update: Partial<UserProfileModel>;
    userId: string;
}

export interface MethodSetUserProfileUpdateProfilePhotoModel {
    key: string;
    userId: string;
}
