import { CalendarAtom } from '@/components/atoms';
import { CalendarAtomProps, FormFieldProps } from '@/types/components';
import { FieldValues, useController } from 'react-hook-form';

interface CalendarFieldProps<T extends FieldValues = FieldValues>
    extends FormFieldProps<T>,
    Omit<CalendarAtomProps, 'value' | 'onChange' | 'onBlur'> { }

export const CalendarField = <T extends FieldValues = FieldValues>({
    name,
    control,
    label,
    required = false,
    disabled = false,
    placeholder,
    className,
    ...calendarProps
}: CalendarFieldProps<T>) => {
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

            <CalendarAtom
                {...calendarProps}
                className={className}
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

export default CalendarField;
