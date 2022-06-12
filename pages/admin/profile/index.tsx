import { Avatar, Button, Card, Divider, Input, Loading, Text } from '@nextui-org/react';
import { Usuario } from '@prisma/client';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ProfilePicture from '../../../components/profile/ProfilePicture';
import RequiredTextError from '../../../components/RequiredText';
import useProfile from '../../../hooks/useProfile';
import ApiGateway from '../../../services/api-gateway';
import AdminLayout from '../layout/AdminLayout';

export default function ProfileView() {
    const { profile } = useProfile();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Usuario>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        reset(profile);
    }, [profile, reset]);

    const onSubmit = async (data: Usuario): Promise<void> => {
        try {
            if (!profile) {
                return;
            }
            setIsLoading(true);
            await ApiGateway.updateData<Usuario>(`/api/users/${profile.id}`, data);
            toast.success('Tus datos han sido actualizados');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = (): void => {
        supabaseClient.auth.signOut();
        location.reload();
    };

    return (
        <div className="w-full h-full flex items-center flex-col">
            <div className="flex flex-col max-w-md w-full items-center">
                {profile && <ProfilePicture profile={profile} />}
            </div>
            <Card className="max-w-md w-full mt-10">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-md flex-1 my-2">
                    <Text h4>Datos Generales</Text>
                    <Divider className="mb-4"></Divider>
                    <div className="flex flex-col gap-2">
                        <Input {...register('nombre', { required: true })} clearable label="Nombre y Apellido" />
                        {errors.nombre && <RequiredTextError />}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Input {...register('correo', { required: true })} label="Correo Electrónico" readOnly />
                        {errors.correo && <RequiredTextError />}
                    </div>
                    <Button
                        type="submit"
                        iconRight={isLoading && <Loading type="points-opacity" color="currentColor" size="lg" />}
                        disabled={isLoading}
                        className="mt-10"
                        rounded
                    >
                        Actualizar Datos
                    </Button>
                </form>
            </Card>
            <Button color="error" rounded className="mt-10" onClick={signOut}>
                Cerrar Sesión
            </Button>
        </div>
    );
}

ProfileView.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
