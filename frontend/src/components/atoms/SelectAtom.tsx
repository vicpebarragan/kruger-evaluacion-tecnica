import { SelectAtomProps } from '@/types/components';
import { cn } from '@/utils/cn';
import { Select as AntSelect } from 'antd';
import React from 'react';

export const SelectAtom: React.FC<SelectAtomProps> = ({
    className,
    options,
    value,
    defaultValue,
    onChange,
    onBlur,
    placeholder,
    disabled = false,
    loading = false,
    allowClear = false,
    mode,
    size = 'middle',
    showSearch = false,
    filterOption = true,
    ...props
}) => {
    const handleChange = (val: string | number | (string | number)[]) => {
        onChange?.(val);
    };

    return (
        <AntSelect
            {...props}
            className={cn('w-full', className)}
            options={options}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            loading={loading}
            allowClear={allowClear}
            mode={mode}
            size={size}
            showSearch={showSearch}
            filterOption={filterOption}
        />
    );
};

export default SelectAtom;
