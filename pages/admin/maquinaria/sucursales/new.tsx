import { Button, Input, Loading } from '@nextui-org/react';
import { SucursalMaquinaria } from '@prisma/client';
import { IconArrowLeft } from '@supabase/ui';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import RequiredTextError from '../../../../components/RequiredText';
import ApiGateway from '../../../../services/api-gateway';
import { TipoRol } from '../../../../utils/constants';
import { ERROR_MESSAGE } from '../../../../constants';
import AdminLayout from '../../layout/AdminLayout';

export default function NewSucursalMaquinaria() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SucursalMaquinaria>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit: SubmitHandler<SucursalMaquinaria> = async (data) => {
        try {
            setIsLoading(true);
            await ApiGateway.create<SucursalMaquinaria>('/api/maquinaria/sucursales', { ...data, idGiroNegocio: 3 });
            toast.success('Sucursal Guardada');
        } catch (error) {
            toast.error(ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex gap-6 items-center mb-10 w-full">
                <div
                    className="cursor-pointer bg-zinc-900 text-white flex items-center justify-center rounded-full w-12 h-12 hover:bg-zinc-700"
                    onClick={() => router.back()}
                >
                    <IconArrowLeft size={20} />
                </div>
                <h2>Nueva Sucursal de Maquinaria</h2>
            </div>
            <div className="flex items-center justify-center mt-20">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-md flex-1">
                    <div className="flex flex-col gap-2">
                        <Input {...register('nombre', { required: true })} clearable label="Nombre de Sucursal" />
                        {errors.nombre && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input {...register('ubicacion', { required: true })} clearable label="Dirección exacta" />
                        {errors.ubicacion && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input {...register('telefono', { required: true })} clearable label="Teléfono" />
                        {errors.telefono && <RequiredTextError />}
                    </div>

                    <Button
                        type="submit"
                        iconRight={isLoading && <Loading type="points-opacity" color="currentColor" size="lg" />}
                        disabled={isLoading}
                    >
                        Crear Planta Minera
                    </Button>
                </form>
            </div>
        </div>
    );
}

NewSucursalMaquinaria.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
