import { FormProviderProps } from '@/types/components';
import {
    FieldValues,
    FormProvider as RHFFormProvider,
    useForm,
    UseFormReturn,
} from 'react-hook-form';

interface FormProviderWithSchemaProps<T extends FieldValues = FieldValues>
    extends FormProviderProps<T> {
    formMethods?: UseFormReturn<T>;
}

export const FormProvider = <T extends FieldValues = FieldValues>({
    children,
    onSubmit,
    defaultValues,
    mode = 'onChange',
    formMethods,
    className,
}: FormProviderWithSchemaProps<T>) => {
    // Always call useForm, but use provided methods if available
    const defaultMethods = useForm<T>({
        defaultValues: defaultValues as any,
        mode,
    });

    const methods = formMethods || defaultMethods;

    const handleSubmit = methods.handleSubmit(async data => {
        try {
            await onSubmit(data as T);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    });

    return (
        <RHFFormProvider {...(methods as any)}>
            <form onSubmit={handleSubmit} className={className} noValidate>
                {children}
            </form>
        </RHFFormProvider>
    );
};

export default FormProvider;
