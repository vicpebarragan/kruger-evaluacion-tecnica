import { FormFieldProps } from '@/types/components';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';
import { FieldValues, useController } from 'react-hook-form';

interface PasswordFieldProps<T extends FieldValues = FieldValues>
    extends FormFieldProps<T> {
    placeholder?: string;
    className?: string;
    size?: 'small' | 'middle' | 'large';
    prefix?: React.ReactNode;
}

export const PasswordField = <T extends FieldValues = FieldValues>({
    name,
    control,
    label,
    required = false,
    disabled = false,
    placeholder,
    className,
    size = 'middle',
    prefix,
}: PasswordFieldProps<T>) => {
    const {
        field: { value, onChange, onBlur },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <div className='space-y-1'>
            {label && (
                <label className='block text-sm font-medium text-gray-700'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}

            <Input.Password
                className={className}
                placeholder={placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                disabled={disabled}
                size={size}
                prefix={prefix}
                status={error ? 'error' : undefined}
                iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
            />

            {error && <p className='text-sm text-red-500'>{error.message}</p>}
        </div>
    );
};
