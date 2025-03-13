import { Mongo } from 'meteor/mongo';
import { AvailableCollectionNames } from '../utils/models';
import SystemChangeLogModel from './models';

const SystemChangeLogsCollection = new Mongo.Collection<SystemChangeLogModel>(
    AvailableCollectionNames.SYSTEM_CHANGE_LOGS,
);

export default SystemChangeLogsCollection;
