import { Button, Table, Tooltip } from '@nextui-org/react';
import { VehiculoTransporte } from '@prisma/client';
import { IconEdit, IconMapPin } from '@supabase/ui';
import Link from 'next/link';
import useSWR from 'swr';
import usePermissions from '../../hooks/usePermissions';
import ApiGateway from '../../services/api-gateway';
import { TipoGiroNegocio } from '../../utils/constants';
import { IconButton } from '../IconButton';
import Loading from '../Loading';

export default function Vehiculos() {
    const {
        data: vehiculos,
        isValidating: isLoading,
        error,
    } = useSWR<VehiculoTransporte[]>('/api/vehiculos', ApiGateway.fetchAll);
    const { canCreate, canUpdate } = usePermissions();

    return (
        <div className="flex w-full flex-col">
            <h3>Vehículos de transporte</h3>
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-4">
                    {/* <Link href="productos/new">
                        <Button>Nuevo Vehículo</Button>
                    </Link> */}
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
                            <Table.Column>Placas</Table.Column>
                            <Table.Column>Marca</Table.Column>
                            <Table.Column>Modelo</Table.Column>
                            <Table.Column>Año</Table.Column>
                            <Table.Column>Estado</Table.Column>
                            <Table.Column>{''}</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {error && <></>}
                            {vehiculos?.map((d) => (
                                <Table.Row key={d.id}>
                                    <Table.Cell>{d.placas}</Table.Cell>
                                    <Table.Cell>{d.marca}</Table.Cell>
                                    <Table.Cell>{d.modelo}</Table.Cell>
                                    <Table.Cell>{d.year}</Table.Cell>
                                    <Table.Cell>{d.disponible ? 'Disponible' : 'En Ruta'}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex gap-2 items-center">
                                            <Tooltip content="GPS">
                                                <Link href="">
                                                    <IconButton>
                                                        <IconMapPin size={20} />
                                                    </IconButton>
                                                </Link>
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
