import { Button, Table, Tooltip } from '@nextui-org/react';
import { Producto } from '@prisma/client';
import { IconEdit } from '@supabase/ui';
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import useSWR from 'swr';
import { IconButton } from '../../../components/IconButton';
import Loading from '../../../components/Loading';
import usePermissions from '../../../hooks/usePermissions';
import ApiGateway from '../../../services/api-gateway';
import { TipoGiroNegocio } from '../../../utils/constants';
import AdminLayout from '../layout/AdminLayout';

export default function ProductsView() {
    const {
        data: productos,
        isValidating: isLoading,
        error,
        mutate,
    } = useSWR<Producto[]>('/api/productos', ApiGateway.fetchAll);
    const [visible, setVisible] = useState(false);
    const [planta, setPlanta] = useState<Producto | null>();
    const { canCreate, canUpdate } = usePermissions();

    const closeHandler = () => {
        setVisible(false);
        setPlanta(null);
    };

    return (
        <div>
            <h2 className="mb-10">Productos</h2>
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-4">
                    {canCreate(TipoGiroNegocio.MATERIA_PRIMA) && (
                        <Link href="productos/new">
                            <Button>Nuevo Producto</Button>
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
                            <Table.Column>Código</Table.Column>
                            <Table.Column>Nombre</Table.Column>
                            <Table.Column>Precio</Table.Column>
                            <Table.Column>Descripción</Table.Column>
                            <Table.Column>{''}</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {error && <></>}
                            {productos?.map((d) => (
                                <Table.Row key={d.id}>
                                    <Table.Cell>{d.id}</Table.Cell>
                                    <Table.Cell>{d.name}</Table.Cell>
                                    <Table.Cell>
                                        {(d.price as { currencyCode: string })['currencyCode']}{' '}
                                        {(d.price as { value: string })['value']}
                                    </Table.Cell>
                                    <Table.Cell>{d.descriptionHtml}</Table.Cell>
                                    <Table.Cell>
                                        {canUpdate(TipoGiroNegocio.MATERIA_PRIMA) && (
                                            <div className="flex gap-2 items-center">
                                                <Tooltip content="Editar Planta Minera">
                                                    <Link href={`productos/${d.id}`}>
                                                        <IconButton>
                                                            <IconEdit size={20} />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>
                                            </div>
                                        )}
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

ProductsView.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
