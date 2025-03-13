import { LoadingOutlined } from '@ant-design/icons';
import { ConfigProvider, theme } from 'antd';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import { MethodGetAWSFileFromS3Model } from '../api/aws/models';
import { AvailableUserRoles, MethodGetRolesUserRolesModel, ResultGetRolesUserRolesModel } from '../api/roles/models';
import UserProfileModel from '../api/userProfile/models';
import { AvailableCollectionNames, MethodUtilMethodsFindCollectionModel } from '../api/utils/models';
import { ComponentProps } from '../types/interfaces';
import { adminRoutes, protectedRoutes, publicRoutes } from '../utils/constants/routes';
import { errorResponse } from '../utils/errors';
import RouteRenderer from './components/RouteRenderer';

export interface MiniAppUserProfileModel extends Pick<UserProfileModel, '_id' | 'username' | 'photo'> {}

const miniAppUserProfileFields = {
    _id: 1,
    username: 1,
    photo: 1,
};

/**
 * Defines the type for a userId on login
 *
 * null - not logged in
 * undefined - loading data
 * string - logged in (user id)
 */
export type AppUserIdModel = string | undefined | null;

export interface BasicSiteProps extends ComponentProps {
    userId?: string;
    userProfile?: MiniAppUserProfileModel;
    userRoles?: AvailableUserRoles[];
    profilePhoto?: string | undefined;
}

const App: React.FC = () => {
    const userId: AppUserIdModel = useTracker(() => Meteor.userId());
    /**
     * Basic public profile data that is required by most pages (reduces fetch requests)
     */
    const [userProfile, setUserProfile] = useState<MiniAppUserProfileModel | undefined>();
    const [loading, setLoading] = useState(true);
    const [userRoles, setUserRoles] = useState<AvailableUserRoles[]>([]);
    const [profilePhoto, setProfilePhoto] = useState<string | undefined>();

    const fetchUserRole = async () => {
        if (!userId) return;

        try {
            const findData: MethodGetRolesUserRolesModel = {
                userIds: [userId],
            };

            const res: ResultGetRolesUserRolesModel = await Meteor.callAsync('get.roles.userRoles', findData);

            setUserRoles(res.result.find((r) => r.userId === userId)?.roles ?? []);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get roles');
        }

        return undefined;
    };

    const fetchUserProfile = async () => {
        if (!userId) return;

        try {
            const findData: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.USER_PROFILE,
                selector: {
                    userId,
                },
                options: {
                    fields: miniAppUserProfileFields,
                },
                onlyOne: true,
            };

            const res: MiniAppUserProfileModel | undefined = await Meteor.callAsync(
                'utilMethods.findCollection',
                findData,
            );

            setUserProfile(res);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        }

        return undefined;
    };

    const fetchProfilePhoto = async (key: string) => {
        try {
            const data: MethodGetAWSFileFromS3Model = {
                key: key,
            };

            const res: string | undefined = await Meteor.callAsync('get.aws.fileFromS3', data);

            setProfilePhoto(res);
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get some images');
        }
    };

    const fetchData = async (silent = false) => {
        setLoading(!silent);

        if (userId) {
            const profile = await fetchUserProfile();
            await fetchUserRole();
            // allow to lazy load
            if (profile?.photo?.key) fetchProfilePhoto(profile?.photo?.key);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        } else {
            setUserProfile(undefined);
            setLoading(false);
        }
    }, [userId]);

    // user is not logged in
    if (userId === null) {
        // you can add any config providers here to cover all public routes
        return (
            <ConfigProvider
                theme={{
                    // change to defaultAlgorithm for light theme
                    algorithm: theme.darkAlgorithm,
                }}
            >
                <Switch>
                    {Object.values(publicRoutes).map((route) => (
                        <Route key={route.path} path={route.path}>
                            <RouteRenderer>{route.element}</RouteRenderer>
                        </Route>
                    ))}
                </Switch>
            </ConfigProvider>
        );
    }

    // still loading data from backend
    if (userId === undefined) return <LoadingOutlined />;

    // you can add any config providers here to cover all protected routes
    return (
        <ConfigProvider
            theme={{
                // change to defaultAlgorithm for light theme
                algorithm: theme.darkAlgorithm,
            }}
        >
            <Switch>
                {userRoles.includes(AvailableUserRoles.ADMIN) &&
                    Object.values(adminRoutes).map((route) => (
                        <Route key={route.path} path={route.path}>
                            <RouteRenderer
                                profilePhoto={profilePhoto}
                                userId={userId}
                                userProfile={userProfile}
                                userRoles={userRoles}
                            >
                                {React.cloneElement(route.element, { userId, userProfile, userRoles, profilePhoto })}
                            </RouteRenderer>
                        </Route>
                    ))}

                {Object.values(protectedRoutes).map((route: any) => (
                    <Route key={route.path} path={route.path}>
                        <RouteRenderer
                            profilePhoto={profilePhoto}
                            userId={userId}
                            userProfile={userProfile}
                            userRoles={userRoles}
                        >
                            {React.cloneElement(route.element, { userId, userProfile, userRoles, profilePhoto })}
                        </RouteRenderer>
                    </Route>
                ))}

                {/* since public routes contains the home routes, they need to be placed last */}
                {Object.values(publicRoutes).map((route) => (
                    <Route key={route.path} path={route.path}>
                        <RouteRenderer
                            profilePhoto={profilePhoto}
                            userId={userId}
                            userProfile={userProfile}
                            userRoles={userRoles}
                        >
                            {React.cloneElement(route.element, { userId, userProfile, userRoles, profilePhoto })}
                        </RouteRenderer>
                    </Route>
                ))}
            </Switch>
        </ConfigProvider>
    );
};

export default App;
