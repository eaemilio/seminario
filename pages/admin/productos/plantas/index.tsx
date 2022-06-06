import { Button, Table, Tooltip, User } from '@nextui-org/react';
import { PlantaProcesado, Usuario } from '@prisma/client';
import { IconEdit, IconTrash2 } from '@supabase/ui';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { IconButton } from '../../../../components/IconButton';
import Loading from '../../../../components/Loading';
import usePermissions from '../../../../hooks/usePermissions';
import ApiGateway from '../../../../services/api-gateway';
import { TipoGiroNegocio } from '../../../../utils/constants';
import { ERROR_MESSAGE, GiroNegocio } from '../../../constants';
import AdminLayout from '../../layout/AdminLayout';

export default function PlantasProcesado() {
    const {
        data: plantas,
        isValidating: isLoading,
        error,
        mutate,
    } = useSWR<(PlantaProcesado & { Usuario: Usuario })[]>('/api/productos/plantas', ApiGateway.fetchAll);
    const [visible, setVisible] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [planta, setPlanta] = useState<PlantaProcesado | null>();
    const { canCreate, canUpdate, canDelete } = usePermissions();

    const closeHandler = () => {
        setVisible(false);
        setPlanta(null);
    };

    const deleteHandler = (data: PlantaProcesado) => {
        setVisible(true);
        setPlanta(data);
    };

    const confirmationHandler = async () => {
        try {
            setIsUpdating(true);
            const updated = await ApiGateway.updateData<PlantaProcesado>(`/api/productos/plantas/${planta?.id}`, {
                active: false,
            });
            const filtered = plantas?.filter((p) => updated.id !== p.id);
            mutate(filtered);
            setVisible(false);
            setPlanta(null);
            toast.success(`Se ha eliminado la planta minera #${updated.id}`);
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
                title={`Deseas continuar con esta acción?`}
                body="No podrás recuperar la información de este registro si continuas"
                loading={isUpdating}
            />
            <h2 className="mb-10">Plantas de Procesado</h2>
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-4">
                    {canCreate(TipoGiroNegocio.MATERIA_PRIMA) && (
                        <Link href="plantas/new">
                            <Button>Nueva Planta</Button>
                        </Link>
                    )}
                </div>
                <div className="w-full h-fit relative">
                    {isLoading && <Loading />}
                    <Table
                        aria-label="Example table with static content"
                        css={{
                            height: 'auto',
                            minWidth: '100%',
                        }}
                        striped={true}
                    >
                        <Table.Header>
                            <Table.Column>Encargado</Table.Column>
                            <Table.Column>Nombre</Table.Column>
                            <Table.Column>Ubicación</Table.Column>
                            <Table.Column>Teléfono</Table.Column>
                            <Table.Column>ID</Table.Column>
                            <Table.Column>{''}</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {error && <></>}
                            {plantas?.map((d) => (
                                <Table.Row key={d.id}>
                                    {d.Usuario ? (
                                        <Table.Cell>
                                            <User name={d.Usuario.nombre} src={d.Usuario.avatarUrl ?? ''}></User>
                                        </Table.Cell>
                                    ) : (
                                        <></>
                                    )}
                                    <Table.Cell>{d.nombre}</Table.Cell>
                                    <Table.Cell>{d.ubicacion}</Table.Cell>
                                    <Table.Cell>{d.telefono}</Table.Cell>
                                    <Table.Cell>{d.id}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex gap-2 items-center">
                                            {canUpdate(TipoGiroNegocio.MATERIA_PRIMA) && (
                                                <Tooltip content="Editar Planta de Procesado">
                                                    <Link href={`plantas/${d.id}`}>
                                                        <IconButton>
                                                            <IconEdit size={20} />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>
                                            )}
                                            {canDelete(TipoGiroNegocio.MATERIA_PRIMA) && (
                                                <Tooltip content="Eliminar Planta de Procesado" color="error">
                                                    <IconButton onClick={() => deleteHandler(d)}>
                                                        <IconTrash2 size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
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

PlantasProcesado.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
