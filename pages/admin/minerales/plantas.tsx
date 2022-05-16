import { Table, User } from '@nextui-org/react';
import { ReactElement } from 'react';
import useSWR from 'swr';
import Loading from '../../../components/Loading';
import { fetchPlantasMineras } from '../../../services/minerales/plantas';
import AdminLayout from '../layout/AdminLayout';

export default function PlantaMinera() {
    const { data, isValidating: isLoading, error } = useSWR('/api/minerales/plantas', fetchPlantasMineras);

    return (
        <div>
            <h2 className="mb-20">Plantas de Extracción Minera</h2>
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
                        <Table.Column>Encargado</Table.Column>
                        <Table.Column>Nombre</Table.Column>
                        <Table.Column>Ubicación</Table.Column>
                        <Table.Column>Teléfono</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {error && <></>}
                        {data?.map((d) => (
                            <Table.Row key="1">
                                {d.Usuario && (
                                    <Table.Cell>
                                        <User name={d.Usuario.nombre}></User>
                                    </Table.Cell>
                                )}
                                <Table.Cell>{d.nombre}</Table.Cell>
                                <Table.Cell>{d.dirreccion}</Table.Cell>
                                <Table.Cell>{d.id}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
}

PlantaMinera.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
