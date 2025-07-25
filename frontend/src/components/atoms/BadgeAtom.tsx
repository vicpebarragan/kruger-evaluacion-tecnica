import { BadgeAtomProps } from '@/types/components';
import { cn } from '@/utils/cn';
import { Badge as AntBadge } from 'antd';
import React from 'react';

export const BadgeAtom: React.FC<BadgeAtomProps> = ({
    className,
    children,
    count,
    text,
    color,
    status,
    size = 'default',
    dot = false,
    showZero = false,
    offset,
    ...props
}) => {
    // Si es un badge de estado sin children
    if (status && !children) {
        return (
            <AntBadge.Ribbon {...props} className={cn(className)} text={text || count} color={color}>
                <div />
            </AntBadge.Ribbon>
        );
    }

    // Si es un badge de texto simple
    if (text && !children && !count) {
        return (
            <AntBadge {...props} className={cn(className)} status={status} text={text} color={color} />
        );
    }

    // Badge normal con children
    return (
        <AntBadge
            {...props}
            className={cn(className)}
            count={count}
            color={color}
            status={status}
            size={size}
            dot={dot}
            showZero={showZero}
            offset={offset}
        >
            {children}
        </AntBadge>
    );
};

export default BadgeAtom;
