import { ReactNode } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

// Base component props
export interface BaseComponentProps {
    className?: string;
    children?: ReactNode;
}

// Form field props for RHF integration
export interface FormFieldProps<T extends FieldValues = FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
}

// Input component props
export interface InputAtomProps extends BaseComponentProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    disabled?: boolean;
    error?: boolean;
    size?: 'small' | 'middle' | 'large';
    prefix?: ReactNode;
    suffix?: ReactNode;
    allowClear?: boolean;
}

// Select component props
export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface SelectAtomProps extends BaseComponentProps {
    options: SelectOption[];
    value?: string | number | (string | number)[];
    defaultValue?: string | number | (string | number)[];
    onChange?: (value: string | number | (string | number)[]) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    allowClear?: boolean;
    mode?: 'multiple' | 'tags';
    size?: 'small' | 'middle' | 'large';
    showSearch?: boolean;
    filterOption?: boolean | ((input: string, option?: SelectOption) => boolean);
}

// Calendar/DatePicker props
export interface CalendarAtomProps extends BaseComponentProps {
    value?: Date;
    defaultValue?: Date;
    onChange?: (date: Date | null) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    format?: string;
    size?: 'small' | 'middle' | 'large';
    showTime?: boolean;
    allowClear?: boolean;
    picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
}

// Badge component props
export interface BadgeAtomProps extends BaseComponentProps {
    count?: number;
    text?: string;
    color?: string;
    status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
    size?: 'default' | 'small';
    dot?: boolean;
    showZero?: boolean;
    offset?: [number, number];
}

// Form provider props
export interface FormProviderProps<T extends FieldValues = FieldValues> extends BaseComponentProps {
    onSubmit: (data: T) => void | Promise<void>;
    defaultValues?: Partial<T>;
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}
