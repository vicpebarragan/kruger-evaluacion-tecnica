import { CalendarAtomProps } from '@/types/components';
import { cn } from '@/utils/cn';
import { DatePicker as AntDatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

export const CalendarAtom: React.FC<CalendarAtomProps> = ({
    className,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    format = 'YYYY-MM-DD',
    size = 'middle',
    showTime = false,
    allowClear = true,
    picker = 'date',
    ...props
}) => {
    const handleChange = (date: Dayjs | null) => {
        onChange?.(date ? date.toDate() : null);
    };

    const dayjsValue = value ? dayjs(value) : undefined;
    const dayjsDefaultValue = defaultValue ? dayjs(defaultValue) : undefined;

    return (
        <AntDatePicker
            {...props}
            className={cn('w-full', className)}
            value={dayjsValue}
            defaultValue={dayjsDefaultValue}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            format={format}
            size={size}
            showTime={showTime}
            allowClear={allowClear}
            picker={picker}
        />
    );
};

export default CalendarAtom;
