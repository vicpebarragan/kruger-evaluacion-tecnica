'use client';

import { ConfigProvider, theme } from 'antd';
import { ReactNode } from 'react';

interface AntdProviderProps {
    children: ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#8b5cf6',
                    colorBgBase: '#1e293b',
                    colorTextBase: '#f1f5f9',
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
}
