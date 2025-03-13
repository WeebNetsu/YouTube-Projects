import { LoadingOutlined } from '@ant-design/icons';
import { capitalizeFirstLetter, checkStrEmpty, formatToHumanDate } from '@netsu/js-utils';
import { Button, Checkbox, Descriptions, Drawer, Input, List, Select, Space, Typography } from 'antd';
import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import SystemChangeLogsModel from '/imports/api/systemChangeLogs/models';
import { UserModel } from '/imports/api/users/models';
import { AvailableCollectionNames, MethodUtilMethodsFindCollectionModel } from '/imports/api/utils/models';
import { MongoDBSelector } from '/imports/types/interfaces';
import { errorResponse } from '/imports/utils/errors';
import { getUserEmail } from '/imports/utils/meteor';

interface MiniAdminLogsPageUserModel extends Pick<UserModel, '_id' | 'emails'> {}

const miniAdminLogsPageUserFields = {
    _id: 1,
    emails: 1,
};

enum AvailableSystemLogsSearchOptions {
    SUBJECT = 'subject',
    NOTE = 'note',
    UPDATE = 'update',
    ALL = 'all',
}

interface AdminLogsPageProps {}

const AdminLogsPage: React.FC<AdminLogsPageProps> = () => {
    const [loading, setLoading] = useState(true);
    const [systemLogs, setSystemLogs] = useState<SystemChangeLogsModel[]>([]);
    const [allSystemLogsCount, setAllSystemLogsCount] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedLog, setSelectedLog] = useState<SystemChangeLogsModel | undefined>();
    const [loadingTable, setLoadingTable] = useState(false);
    const [focusSearchParameter, setFocusSearchParameter] = useState<AvailableSystemLogsSearchOptions>(
        AvailableSystemLogsSearchOptions.ALL,
    );
    const [strictSearch, setStrictSearch] = useState(false);
    const [users, setUsers] = useState<MiniAdminLogsPageUserModel[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const refreshUsers = async (userIds: string[]): Promise<MiniAdminLogsPageUserModel[]> => {
        setLoadingUsers(true);
        try {
            const findData: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.USERS,
                selector: {
                    _id: {
                        $in: userIds,
                    },
                },
                options: {
                    fields: miniAdminLogsPageUserFields,
                },
            };

            const res: MiniAdminLogsPageUserModel[] = await Meteor.callAsync('utilMethods.findCollection', findData);

            setUsers(res);

            return res;
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
        } finally {
            setLoadingUsers(false);
        }

        return [];
    };

    const refreshSystemLogs = async (skip = 0, limit = 100): Promise<SystemChangeLogsModel[]> => {
        let currentLogs: SystemChangeLogsModel[] = [];
        try {
            const regex = new RegExp(search, 'ig');

            const orValue = [];

            switch (focusSearchParameter) {
                case AvailableSystemLogsSearchOptions.SUBJECT:
                    orValue.push({
                        subject: strictSearch ? search : { $regex: regex },
                    });
                    break;
                case AvailableSystemLogsSearchOptions.NOTE:
                    orValue.push({
                        note: strictSearch ? search : { $regex: regex },
                    });
                    break;
                case AvailableSystemLogsSearchOptions.UPDATE:
                    orValue.push({
                        update: strictSearch ? search : { $regex: regex },
                    });
                    break;
                case AvailableSystemLogsSearchOptions.ALL:
                    orValue.push(
                        {
                            subject: strictSearch ? search : { $regex: regex },
                        },
                        {
                            note: strictSearch ? search : { $regex: regex },
                        },
                        {
                            update: strictSearch ? search : { $regex: regex },
                        },
                    );
                    break;
                default:
                    break;
            }

            let selector: MongoDBSelector = {};

            if (!checkStrEmpty(search)) {
                selector = {
                    $or: orValue,
                };
            }

            const findData: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.SYSTEM_CHANGE_LOGS,
                selector,
                options: {
                    limit,
                    skip: (skip > 0 ? skip - 1 : skip) * limit,
                    sort: { createdAt: -1 },
                },
            };

            currentLogs = await Meteor.callAsync('utilMethods.findCollection', findData);

            setSystemLogs(currentLogs);

            const findDataCount: MethodUtilMethodsFindCollectionModel = {
                collection: AvailableCollectionNames.SYSTEM_CHANGE_LOGS,
                selector,
                count: true,
            };

            const count: number = await Meteor.callAsync('utilMethods.findCollection', findDataCount);
            setAllSystemLogsCount(count);
        } catch (error) {
            errorResponse(error as Meteor.Error, 'Could not get users');
            return [];
        }

        return currentLogs;
    };

    const fetchData = async (silent = false) => {
        if (!silent) setLoading(true);

        const logs = await refreshSystemLogs();
        await refreshUsers(logs.map((log) => log.userId));

        setLoading(false);
    };

    const handleSearch = async (skip = 0, limit = 10) => {
        setLoadingTable(true);

        await refreshSystemLogs(skip, limit);

        setLoadingTable(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <LoadingOutlined />;

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Title level={2}>System Logs</Typography.Title>

            <Space style={{ width: '100%', justifyContent: 'center' }}>
                <Input.Search
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={'Search Logs'}
                    onSearch={() => handleSearch()}
                />

                <Select
                    value={focusSearchParameter}
                    style={{ width: 150 }}
                    onChange={(e: AvailableSystemLogsSearchOptions | string) => {
                        setFocusSearchParameter(e as AvailableSystemLogsSearchOptions);
                    }}
                    options={Object.values(AvailableSystemLogsSearchOptions).map((val) => ({
                        value: val,
                        label: capitalizeFirstLetter(val.split('_').join(' ')),
                    }))}
                />

                <Checkbox checked={strictSearch} onChange={(e) => setStrictSearch(e.target.checked)}>
                    Strict Search
                </Checkbox>
            </Space>

            <List
                bordered
                dataSource={systemLogs}
                // pagination={false}
                renderItem={(item) => (
                    <List.Item
                        actions={[
                            <Button onClick={() => setSelectedLog(item)} type="link">
                                Details
                            </Button>,
                        ]}
                    >
                        <List.Item.Meta
                            title={`${formatToHumanDate(item.createdAt)} (logged by ${getUserEmail(users.find((user) => user._id === item.userId))})`}
                            description={item.subject}
                        />
                    </List.Item>
                )}
                style={{ marginBottom: '15px' }}
                pagination={{
                    pageSize: 100,
                    total: allSystemLogsCount,
                    onChange(page, pageSize) {
                        handleSearch(page, pageSize);
                    },
                }}
                loading={loadingTable}
            />

            <Drawer
                onClose={() => {
                    setSelectedLog(undefined);
                }}
                placement="right"
                open={selectedLog !== undefined}
                width={Math.min(720, window.screen.width)}
                styles={{
                    body: {
                        marginBottom: '3rem',
                    },
                }}
            >
                {selectedLog && (
                    <Descriptions bordered size="small" title="Log Details">
                        <Descriptions.Item label="Date" span={3}>
                            Date:
                            {selectedLog.createdAt.toLocaleDateString()} <br /> Time:{' '}
                            {selectedLog.createdAt.toLocaleTimeString()}
                        </Descriptions.Item>

                        <Descriptions.Item label="User" span={3}>
                            {getUserEmail(users.find((user) => user._id === selectedLog.userId))} ({selectedLog.userId})
                        </Descriptions.Item>

                        <Descriptions.Item label="Subject" span={3}>
                            {selectedLog.subject}
                        </Descriptions.Item>

                        <Descriptions.Item label="Update" span={3}>
                            <p>{selectedLog.update}</p>
                        </Descriptions.Item>

                        <Descriptions.Item label="Previous State" span={3}>
                            {JSON.stringify(selectedLog.previousState)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Note" span={3}>
                            {selectedLog.note}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </Space>
    );
};

export default AdminLogsPage;
