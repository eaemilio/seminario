import { Button, Table, Tooltip } from '@nextui-org/react';
import { Mineral } from '@prisma/client';
import { IconEdit, IconTrash2 } from '@supabase/ui';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { IconButton } from '../../../../components/IconButton';
import Loading from '../../../../components/Loading';
import ApiGateway from '../../../../services/api-gateway';
import { ERROR_MESSAGE } from '../../../../constants';
import AdminLayout from '../../layout/AdminLayout';

export default function Minerales() {
    const {
        data: minerales = [],
        isValidating: isLoading,
        error,
        mutate,
    } = useSWR<Mineral[]>('/api/minerales/tipos', ApiGateway.fetchAll);
    const [visible, setVisible] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [mineral, setMineral] = useState<Mineral | null>();

    const closeHandler = () => {
        setVisible(false);
        setMineral(null);
    };

    const deleteHandler = (data: Mineral) => {
        setVisible(true);
        setMineral(data);
    };

    const confirmationHandler = async () => {
        try {
            setIsUpdating(true);
            const updated = await ApiGateway.updateData<Mineral>(`/api/minerales/tipos/${mineral?.id}`, {
                active: false,
            });
            const filtered = minerales?.filter((p) => updated.id !== p.id);
            mutate(filtered);
            setVisible(false);
            setMineral(null);
            toast.success(`Se ha eliminado el tipo de mineral #${updated.id}`);
        } catch {
            toast.error(ERROR_MESSAGE);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div>
            <ConfirmationDialog
                visible={visible}
                closeHandler={closeHandler}
                confirmationHandler={confirmationHandler}
                title={`Deseas eliminar ${mineral?.nombre}`}
                body="No podrás recuperar la información de este mineral si continuas"
                loading={isUpdating}
            />
            <h2 className="mb-10">Tipos de Minerales</h2>
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-4">
                    <Link href="tipos/new">
                        <Button>Nuevo Mineral</Button>
                    </Link>
                </div>
                <div className="w-full h-fit relative">
                    {isLoading && <Loading />}
                    <Table
                        aria-label="Example table with static content"
                        css={{
                            height: 'auto',
                            minWidth: '100%',
                        }}
                    >
                        <Table.Header>
                            <Table.Column>ID</Table.Column>
                            <Table.Column>Nombre</Table.Column>
                            <Table.Column>Descripción</Table.Column>
                            <Table.Column>Precio de Unidad</Table.Column>
                            <Table.Column>Unidad de Medida</Table.Column>
                            <Table.Column>{''}</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {error && <></>}
                            {minerales.map((d) => (
                                <Table.Row key={d.id}>
                                    <Table.Cell>{d.id}</Table.Cell>
                                    <Table.Cell>{d.nombre}</Table.Cell>
                                    <Table.Cell>{d.descripcion}</Table.Cell>
                                    <Table.Cell>Q. {d.precioUnidad}</Table.Cell>
                                    <Table.Cell>{d.unidadMedida}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex gap-2 items-center">
                                            <Tooltip content="Editar Mineral">
                                                <Link href={`tipos/${d.id}`}>
                                                    <IconButton>
                                                        <IconEdit size={20} />
                                                    </IconButton>
                                                </Link>
                                            </Tooltip>
                                            <Tooltip content="Eliminar Mineral" color="error">
                                                <IconButton onClick={() => deleteHandler(d)}>
                                                    <IconTrash2 size={20} />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
}

Minerales.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
