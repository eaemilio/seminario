import { Button, Table, Tooltip } from '@nextui-org/react';
import { SucursalMaquinaria } from '@prisma/client';
import { IconEdit } from '@supabase/ui';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import useSWR from 'swr';
import { IconButton } from '../../../../components/IconButton';
import Loading from '../../../../components/Loading';
import usePermissions from '../../../../hooks/usePermissions';
import ApiGateway from '../../../../services/api-gateway';
import { TipoGiroNegocio } from '../../../../utils/constants';
import AdminLayout from '../../layout/AdminLayout';

export default function SucursalesMaquinaria() {
    const {
        data: plantas,
        isValidating: isLoading,
        error,
        mutate,
    } = useSWR<SucursalMaquinaria[]>('/api/maquinaria/sucursales', ApiGateway.fetchAll);
    const [visible, setVisible] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [planta, setPlanta] = useState<SucursalMaquinaria | null>();
    const { canCreate, canUpdate, canDelete } = usePermissions();

    return (
        <div>
            <h2 className="mb-10">Plantas de Procesado</h2>
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-4">
                    {canCreate(TipoGiroNegocio.MAQUINARIA) && (
                        <Link href="sucursales/new">
                            <Button>Nueva Sucursal</Button>
                        </Link>
                    )}
                </div>
                <div className="w-full h-fit relative">
                    {isLoading && <Loading />}
                    <Table
                        css={{
                            height: 'auto',
                            minWidth: '100%',
                        }}
                        striped={true}
                    >
                        <Table.Header>
                            <Table.Column>ID</Table.Column>
                            <Table.Column>Nombre</Table.Column>
                            <Table.Column>Ubicación</Table.Column>
                            <Table.Column>Teléfono</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {error && <></>}
                            {plantas?.map((d) => (
                                <Table.Row key={d.id}>
                                    <Table.Cell>{d.id}</Table.Cell>
                                    <Table.Cell>{d.nombre}</Table.Cell>
                                    <Table.Cell>{d.ubicacion}</Table.Cell>
                                    <Table.Cell>{d.telefono}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
}

SucursalesMaquinaria.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
