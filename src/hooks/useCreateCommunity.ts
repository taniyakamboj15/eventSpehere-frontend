import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { communityApi } from '../services/api/community.api';
import { CommunityType } from '../types/community.types';
import { ROUTES } from '../constants/routes';

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
    const navigate = useNavigate();
    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateCommunityForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            type: CommunityType.HOBBY,
            latitude: 51.505,
            longitude: -0.09
        }
    });

    const onSubmit = async (data: CreateCommunityForm) => {
        try {
            await communityApi.create(data);
            toast.success('Community created successfully!');
            navigate(ROUTES.DASHBOARD);
        } catch (error) {
            toast.error('Failed to create community');
            console.error(error);
        }
    };

    return {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        errors,
        isSubmitting,
        onSubmit,
        CommunityType
    };
};
