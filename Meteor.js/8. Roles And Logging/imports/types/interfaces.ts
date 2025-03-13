import { Mongo } from 'meteor/mongo';
import { ReactNode } from 'react';

export interface ComponentProps {
    history?: any;
    location?: any;
    /**
     * @deprecated in newer react versions use `useParams()` instead
     */
    match?: {
        params?: any;
        path: string;
    };
    staticContext?: any;
    children?: ReactNode;
}

export interface SearchableObject {
    [index: string]: any;
}

export interface MongoDBOptions {
    sort?: Mongo.SortSpecifier | undefined;
    skip?: number | undefined;
    limit?: number | undefined;
    fields?: Mongo.FieldSpecifier | undefined;
    reactive?: boolean | undefined;
    transform?: Function | undefined;
}

export type MongoDBSelector = string | Mongo.Selector<any> | Mongo.ObjectID;

export interface MethodSearchModel {
    selector?: MongoDBSelector;
    options?: MongoDBOptions;
    /**
     * Should only one value be returned
     */
    onlyOne?: boolean;
}

export enum AvailableAwsSnsDetailTypes {
    HEALTH_STATUS_CHANGE = 'Health status change',
    OTHER_RESOURCE_STATUS_CHANGE = 'Other resource status change',
}

export enum AvailableAwsSnsDetailStatuses {
    ENVIRONMENT_HEALTH_CHANGED = 'Environment health changed',
    INSTANCE_ADDED = 'Instance added',
    INSTANCE_REMOVED = 'Instance removed',
}

export interface AwsSnsResponse {
    version: string;
    id: string;
    'detail-type': AvailableAwsSnsDetailTypes;
    source: 'aws.elasticbeanstalk';
    account: string;
    time: string;
    region: string;
    resources: string[];
    detail: {
        Status: AvailableAwsSnsDetailStatuses;
        EventDate: number;
        ApplicationName: '';
        Message: string;
        EnvironmentName: '';
        Severity: 'WARN';
    };
}

export interface FroalaEditorModel {
    image: {
        insert: any;
        get: any;
    };
    popups: {
        hideAll: () => void;
    };
}
export interface FroalaFileModel extends Blob {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    /**
     * Side, probably in KB
     */
    size: number;
    type: string;
    webkitRelativePath: string;
}
