import { Button, Input, Loading } from '@nextui-org/react';
import { Mineral } from '@prisma/client';
import { IconArrowLeft } from '@supabase/ui';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import RequiredTextError from '../../../../components/RequiredText';
import ApiGateway from '../../../../services/api-gateway';
import { ERROR_MESSAGE } from '../../../../constants';
import AdminLayout from '../../layout/AdminLayout';

export default function NewMineral() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Mineral>();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<Mineral> = async (data) => {
        try {
            setIsLoading(true);
            await ApiGateway.create<Mineral>('/api/minerales/tipos', data);
            toast.success('Mineral Guardado');
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
                <h2>Nueva Mineral</h2>
            </div>
            <div className="flex items-center justify-center mt-20">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 max-w-md flex-1">
                    <div className="flex flex-col gap-2">
                        <Input
                            {...register('nombre', { required: true })}
                            clearable
                            label="Nombre del Mineral"
                            placeholder="Magnesita"
                        />
                        {errors.nombre && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input
                            {...register('descripcion', { required: true })}
                            clearable
                            label="Descripción del Mineral"
                            placeholder="Carbonato de magnesio"
                        />
                        {errors.descripcion && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="unidadMedida"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                        >
                            Unidad de Medida
                        </label>
                        <select
                            {...register('unidadMedida')}
                            id="unidadMedida"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                        >
                            {['Tonelada (T)'].map((u) => (
                                <option key={u} value={u}>
                                    {u}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Input
                            {...register('precioUnidad', { required: true })}
                            labelLeft="Q."
                            label="Precio por unidad de medida"
                            placeholder="5000"
                            type="number"
                        />
                        {errors.precioUnidad && <RequiredTextError />}
                    </div>

                    <Button
                        type="submit"
                        iconRight={isLoading && <Loading type="points-opacity" color="currentColor" size="lg" />}
                        disabled={isLoading}
                    >
                        Crear Mineral
                    </Button>
                </form>
            </div>
        </div>
    );
}

NewMineral.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
