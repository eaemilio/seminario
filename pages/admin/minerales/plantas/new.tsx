import { Button, Input, Loading, Text } from '@nextui-org/react';
import { PlantaMinera } from '@prisma/client';
import { IconArrowLeft } from '@supabase/ui';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import RequiredTextError from '../../../../components/RequiredText';
import { createPlantaMinera } from '../../../../services/minerales/plantas';
import { fetchUsers } from '../../../../services/users';
import { TipoGiroNegocio, TipoRol } from '../../../../utils/constants';
import AdminLayout from '../../layout/AdminLayout';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from '../../../constants';

export default function NewPlantaMinera() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PlantaMinera>();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<PlantaMinera> = async (data) => {
        try {
            setIsLoading(true);
            await createPlantaMinera('/api/minerales/plantas', data);
            toast.success('Planta Minera Guardada');
        } catch (error) {
            toast.error(ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    const { data: admins = [] } = useSWR(['/api/users', TipoRol.ADMIN, TipoGiroNegocio.MINERIA], fetchUsers);

    return (
        <div className="w-full">
            <div className="flex gap-6 items-center mb-10 w-full">
                <div
                    className="cursor-pointer bg-zinc-900 text-white flex items-center justify-center rounded-full w-12 h-12 hover:bg-zinc-700"
                    onClick={() => router.back()}
                >
                    <IconArrowLeft size={20} />
                </div>
                <h2>Nueva Planta de Extracción</h2>
            </div>
            <div className="flex items-center justify-center mt-20">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-md flex-1">
                    <div className="flex flex-col gap-2">
                        <Input {...register('nombre', { required: true })} clearable label="Nombre de Planta Minera" />
                        {errors.nombre && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input {...register('direccion', { required: true })} clearable label="Dirección exacta" />
                        {errors.direccion && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input {...register('nit', { required: true })} clearable label="NIT" />
                        {errors.nit && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="encargado"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                            Encargado de Planta
                        </label>
                        <select
                            {...register('encargado')}
                            id="encargado"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        >
                            {admins.map((admin) => (
                                <option key={admin.id} value={admin.id}>
                                    {admin.nombre}
                                </option>
                            ))}
                        </select>
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

NewPlantaMinera.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
