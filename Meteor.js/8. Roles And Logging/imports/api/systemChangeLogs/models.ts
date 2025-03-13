/**
 * System-wide logs of any updates running
 */
interface SystemChangeLogsModel {
    _id: string;
    userId: string;
    /**
     * Basic rundown of what changed
     */
    subject: string;
    note?: string;
    /**
     * The update applied to the database
     */
    update: string;
    /**
     * If an item in DB was updated, we may want to provide a prior state
     */
    previousState?: any;
    createdAt: Date;
}

export default SystemChangeLogsModel;

// ---- GET METHOD MODELS ----

// ---- SET METHOD MODELS ----
export interface MethodSetSystemChangeLogsCreateModel
    extends Omit<SystemChangeLogsModel, '_id' | 'createdAt' | 'userId'> {}
