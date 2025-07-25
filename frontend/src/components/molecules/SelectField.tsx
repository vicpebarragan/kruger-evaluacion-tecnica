import { SelectAtom } from '@/components/atoms';
import { FormFieldProps, SelectAtomProps } from '@/types/components';
import { FieldValues, useController } from 'react-hook-form';

interface SelectFieldProps<T extends FieldValues = FieldValues>
    extends FormFieldProps<T>,
    Omit<SelectAtomProps, 'value' | 'onChange' | 'onBlur'> { }

export const SelectField = <T extends FieldValues = FieldValues>({
    name,
    control,
    label,
    required = false,
    disabled = false,
    placeholder,
    className,
    options,
    ...selectProps
}: SelectFieldProps<T>) => {
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

            <SelectAtom
                {...selectProps}
                className={className}
                options={options}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
            />

            {error && <p className='text-sm text-red-500'>{error.message}</p>}
        </div>
    );
};

export default SelectField;
