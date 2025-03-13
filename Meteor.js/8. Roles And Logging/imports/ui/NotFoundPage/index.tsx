import { Typography } from 'antd';
import React from 'react';

interface NotFoundPageProps {
    message?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ message }) => {
    return <Typography>{message ?? 'The page you were looking for was not found'}</Typography>;
};

export default NotFoundPage;
