import { useState, useEffect } from 'react';
import { useForm, type UseFormProps, type FieldValues, type Path } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useActionData, useSubmit } from 'react-router-dom';
import type { AnyObjectSchema } from 'yup';

interface ActionResponse {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
    [key: string]: unknown;
}

export const useActionForm = <T extends FieldValues>(
    schema: AnyObjectSchema,
    action: string,
    formOptions?: UseFormProps<T>
) => {
    const actionData = useActionData() as ActionResponse | undefined;
    const submit = useSubmit();
    const [serverError, setServerError] = useState<string | null>(null);

    const { setError, ...form } = useForm<T>({
        ...formOptions,
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (actionData?.success === false) {
            if (actionData.fieldErrors) {
                Object.keys(actionData.fieldErrors).forEach((field) => {
                    setError(field as Path<T>, {
                        type: 'server',
                        message: actionData.fieldErrors![field],
                    });
                });
            }
            setServerError(actionData.error || 'Operation failed');
        }
    }, [actionData, setError]);

    const onSubmit = (data: T) => {
        setServerError(null);
        submit(data as unknown as Record<string, string>, { method: "post", action });
    };

    return { form, ...form, setError, serverError, onSubmit, actionData };
};
