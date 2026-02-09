import * as Yup from 'yup';
import { CommunityType } from '../types/community.types';
import { ROUTES } from '../constants/routes';

import { useActionForm } from './utils/useActionForm';

const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    type: Yup.string().oneOf(Object.values(CommunityType)).required('Type is required'),
    description: Yup.string().required('Description is required'),
    latitude: Yup.number().required('Location is required'),
    longitude: Yup.number().required('Location is required'),
});

interface CreateCommunityForm {
    name: string;
    type: CommunityType;
    description: string;
    latitude: number;
    longitude: number;
}

export const useCreateCommunity = () => {
    const { form, serverError, onSubmit } = useActionForm<CreateCommunityForm>(
        schema,
        ROUTES.CREATE_COMMUNITY,
        {
            defaultValues: {
                type: CommunityType.HOBBY,
                latitude: 51.505,
                longitude: -0.09
            }
        }
    );

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = form;

    return {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        errors,
        isSubmitting,
        serverError,
        onSubmit,
        CommunityType
    };
};
