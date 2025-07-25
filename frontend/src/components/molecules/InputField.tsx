import { InputAtom } from '@/components/atoms';
import { FormFieldProps, InputAtomProps } from '@/types/components';
import { FieldValues, useController } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues = FieldValues>
    extends FormFieldProps<T>,
    Omit<InputAtomProps, 'value' | 'onChange' | 'onBlur'> { }

export const InputField = <T extends FieldValues = FieldValues>({
    name,
    control,
    label,
    required = false,
    disabled = false,
    placeholder,
    className,
    ...inputProps
}: InputFieldProps<T>) => {
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

            <InputAtom
                {...inputProps}
                className={className}
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                error={!!error}
            />

            {error && <p className='text-sm text-red-500'>{error.message}</p>}
        </div>
    );
};

export default InputField;
