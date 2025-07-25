import { InputAtomProps } from '@/types/components';
import { cn } from '@/utils/cn';
import { Input as AntInput } from 'antd';
import React from 'react';

export const InputAtom: React.FC<InputAtomProps> = ({
    className,
    type = 'text',
    placeholder,
    value,
    defaultValue,
    onChange,
    onBlur,
    disabled = false,
    error = false,
    size = 'middle',
    prefix,
    suffix,
    allowClear = false,
    ...props
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <AntInput
            {...props}
            className={cn(error && 'border-red-500 focus:border-red-500', className)}
            type={type}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            size={size}
            prefix={prefix}
            suffix={suffix}
            allowClear={allowClear}
            status={error ? 'error' : undefined}
        />
    );
};

export default InputAtom;
