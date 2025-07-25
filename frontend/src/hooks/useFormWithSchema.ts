import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';

interface UseFormWithSchemaOptions<T> {
    schema: any; // Simplified type to avoid complex Zod type issues
    defaultValues?: Partial<T>;
    mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export function useFormWithSchema<T extends Record<string, any>>({
    schema,
    defaultValues,
    mode = 'onChange',
}: UseFormWithSchemaOptions<T>): UseFormReturn<T> {
    return useForm<T>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as any,
        mode,
    });
}

export default useFormWithSchema;
