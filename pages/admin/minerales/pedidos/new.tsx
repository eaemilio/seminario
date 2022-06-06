import { Button, Input, Table, Text, Textarea, Tooltip } from '@nextui-org/react';
import { DetallePedidoMineral, Mineral, PedidoMineral, PlantaMinera } from '@prisma/client';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { IconArrowLeft, IconTrash2 } from '@supabase/ui';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { IconButton } from '../../../../components/IconButton';
import DetallePedidoModal from '../../../../components/minerales/DetallePedidoModal';
import RequiredTextError from '../../../../components/RequiredText';
import ApiGateway from '../../../../services/api-gateway';
import AdminLayout from '../../layout/AdminLayout';

export default function NewPedidoMineral() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
    } = useForm<PedidoMineral>();
    const { data: plantas = [] } = useSWR<PlantaMinera[]>('/api/minerales/plantas', ApiGateway.fetchAll);
    const [detalle, setDetalle] = useState<DetallePedidoMineral[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const { user } = useUser();

    const onSubmit: SubmitHandler<PedidoMineral> = async (data): Promise<void> => {
        const { idPlantaMinera, impuestos, nit, nombreCliente, notas, subTotal, total } = data;
        const result = await ApiGateway.create<Partial<PedidoMineral> & { detalle: DetallePedidoMineral[] }>(
            '/api/minerales/pedidos',
            {
                nombreCliente,
                idPlantaMinera: +idPlantaMinera,
                impuestos,
                nit,
                notas,
                subTotal,
                total,
                detalle,
                createdBy: user?.id ?? '',
            },
        );
    };

    const addMateriaPrima = (newDetalle: DetallePedidoMineral): void => {
        setVisible(false);
        if (detalle.find((d) => d.idMineral === newDetalle.idMineral)) {
            toast.error('Mineral ya se encuentra en el detalle');
            return;
        }
        const all: DetallePedidoMineral[] = [...detalle, newDetalle];
        const total = all.map((a) => a.subTotal).reduce((prev, curr) => prev + curr);
        const iva = total * 0.12;
        setValue('subTotal', total - iva);
        setValue('impuestos', iva);
        setValue('total', total);
        setDetalle(all);
    };

    const deleteHandler = (id: number): void => {
        const filtered = detalle.filter((d) => d.idMineral !== id);
        setDetalle([...filtered]);
    };

    return (
        <div>
            <DetallePedidoModal
                visible={visible}
                closeHandler={() => setVisible(false)}
                onSaveHandler={addMateriaPrima}
                idPlantaMinera={getValues().idPlantaMinera}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex gap-6 items-center mb-10 w-full">
                    <div
                        className="cursor-pointer bg-zinc-900 text-white flex items-center justify-center rounded-full w-12 h-12 hover:bg-zinc-700"
                        onClick={() => router.back()}
                    >
                        <IconArrowLeft size={20} />
                    </div>
                    <h2>Nuevo Pedido de Materia Prima</h2>
                </div>
                <div className="flex items-center justify-center w-full flex-col gap-10">
                    <div className="flex w-full gap-4 items-end">
                        <div className="flex flex-col gap-2 min-w-min flex-1">
                            <Input
                                {...register('nombreCliente', { required: true })}
                                clearable
                                labelPlaceholder="Nombre de Cliente"
                                color={errors.nombreCliente ? 'error' : 'default'}
                            />
                            {errors.nombreCliente && <RequiredTextError />}
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <Input
                                {...register('nit', { required: true })}
                                clearable
                                labelPlaceholder="NIT"
                                color={errors.nit ? 'error' : 'default'}
                            />
                            {errors.nit && <RequiredTextError />}
                        </div>
                        <div className="flex flex-col flex-1">
                            <label htmlFor="encargado" className="block mb-2 text-sm font-medium text-zinc-900">
                                Planta Minera
                            </label>
                            <select
                                {...register('idPlantaMinera')}
                                id="planta"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                            >
                                {plantas.map((planta) => (
                                    <option key={planta.id} value={planta.id}>
                                        {planta.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full min-w-min">
                        <Textarea labelPlaceholder="Notas" {...register('notas', { required: true })} />
                        {errors.notas && <RequiredTextError />}
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex justify-between">
                            <Text h3>Detalle del Pedido</Text>
                            <Button flat rounded onClick={() => setVisible(true)}>
                                Agregar Materia Prima
                            </Button>
                        </div>
                        <Text color="warning" size={12}>
                            Agrega materia prima al detalle de este pedido, haciendo click en &quot;Agregar Materia
                            Prima&quot;
                        </Text>
                        <div className="w-full h-fit relative mt-4">
                            <Table
                                aria-label="Example table with static content"
                                css={{
                                    height: 'auto',
                                    minWidth: '100%',
                                }}
                                striped={true}
                            >
                                <Table.Header>
                                    <Table.Column>No.</Table.Column>
                                    <Table.Column>Código de Mineral</Table.Column>
                                    <Table.Column>Nota</Table.Column>
                                    <Table.Column>Cantidad</Table.Column>
                                    <Table.Column>Sub Total</Table.Column>
                                    <Table.Column>{''}</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {detalle.map((value, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{index + 1}</Table.Cell>
                                            <Table.Cell>{value.idMineral}</Table.Cell>
                                            <Table.Cell>{value.nota}</Table.Cell>
                                            <Table.Cell>{value.cantidad}</Table.Cell>
                                            <Table.Cell>Q. {value.subTotal}</Table.Cell>
                                            <Table.Cell>
                                                <div className="flex gap-2 items-center">
                                                    <Tooltip content="Eliminar Detalle" color="error">
                                                        <IconButton onClick={() => deleteHandler(value.idMineral)}>
                                                            <IconTrash2 size={20} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                            <div className="flex w-full mt-10 gap-4">
                                <div className="flex-1">
                                    <Input
                                        {...register('subTotal', { required: true, valueAsNumber: true })}
                                        readOnly
                                        label="Sub Total"
                                        width="100%"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        {...register('impuestos', { required: true, valueAsNumber: true })}
                                        readOnly
                                        label="IVA"
                                        width="100%"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        {...register('total', { required: true, valueAsNumber: true })}
                                        readOnly
                                        label="Total"
                                        width="100%"
                                    />
                                </div>
                            </div>
                            <div className="flex w-full items-center justify-center mt-10">
                                <Button shadow rounded type="submit">
                                    Guardar Pedido
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

NewPedidoMineral.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
