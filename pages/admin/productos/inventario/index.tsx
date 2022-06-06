import { Table, Text } from '@nextui-org/react';
import { InventarioProducto, PlantaProcesado, Producto } from '@prisma/client';
import { ReactElement, useState } from 'react';
import useSWR from 'swr';
import Loading from '../../../../components/Loading';
import InventarioProductoModal from '../../../../components/productos/InventarioProductoModal';
import ApiGateway from '../../../../services/api-gateway';
import { getAllInventario } from '../../../../services/productos/inventario';
import AdminLayout from '../../layout/AdminLayout';

export default function InventarioProductoPage() {
    const [visible, setVisible] = useState(false);
    const [idPlantaProcesado, setIdPlantaProcesado] = useState<number>(0);
    const [idProducto, setIdProducto] = useState<number | null>(null);

    const { data: plantas } = useSWR<PlantaProcesado[]>('/api/productos/plantas', ApiGateway.fetchAll);
    const {
        data: inventario,
        isValidating,
        mutate,
    } = useSWR<(InventarioProducto & { Producto: Producto })[]>(
        ['/api/productos/inventario', idPlantaProcesado],
        getAllInventario,
    );

    const closeHandler = () => {
        setVisible(false);
    };

    const onSaveHandler = (updated: InventarioProducto & { Producto: Producto }) => {
        const filtered = inventario?.filter(
            (i) => i.idProducto !== updated.idProducto && i.idPlantaProcesado !== updated.idPlantaProcesado,
        );
        mutate([...(filtered ?? []), updated]);
        setVisible(false);
    };

    const plantaProcesadoOnChange = (id: number) => {
        setIdPlantaProcesado(id);
    };

    const handleRowClick = (e: 'all' | Set<React.Key>) => {
        if (e === 'all') {
            return;
        }
        e.forEach((item) => setIdProducto(+item));
        setVisible(!visible);
    };

    return (
        <div>
            {idProducto && (
                <InventarioProductoModal
                    visible={visible}
                    closeHandler={closeHandler}
                    onSaveHandler={onSaveHandler}
                    idPlantaProcesado={idPlantaProcesado}
                    idProducto={idProducto}
                />
            )}
            <h2 className="mb-10">Inventario de Productos</h2>
            <Text size={12} className="mb-4">
                Selecciona una planta de procesado para ver su inventario de productos
            </Text>
            <div className="flex flex-col gap-2">
                <label htmlFor="plantaMinera" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
                    Planta Procesado
                </label>
                <select
                    id="plantaMinera"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                    onChange={(e) => plantaProcesadoOnChange(+e.target.value)}
                >
                    <option key="initial" value={0}>
                        Selecciona una Planta de Procesado
                    </option>
                    {plantas?.map((planta) => (
                        <option key={planta.id} value={planta.id}>
                            {planta.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col mt-10">
                <div className="w-full h-fit relative">
                    {isValidating && <Loading />}
                    {inventario && (
                        <Table
                            aria-label="Example table with static content"
                            css={{
                                height: 'auto',
                                minWidth: '100%',
                            }}
                            selectionMode="single"
                            onSelectionChange={(e) => handleRowClick(e)}
                        >
                            <Table.Header>
                                <Table.Column>Producto</Table.Column>
                                <Table.Column>Descripción</Table.Column>
                                <Table.Column>Precio Unitario</Table.Column>
                                <Table.Column>Unidades</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {inventario ? (
                                    inventario
                                        .sort((a, b) => a.Producto.id - b.Producto.id)
                                        .map((item) => (
                                            <Table.Row key={item.Producto.id}>
                                                <Table.Cell>{item.Producto.name}</Table.Cell>
                                                <Table.Cell>{item.Producto.descriptionHtml}</Table.Cell>
                                                <Table.Cell>
                                                    Q. {(item.Producto?.price as { value: number }).value}
                                                </Table.Cell>
                                                <Table.Cell>{item.cantidad}</Table.Cell>
                                            </Table.Row>
                                        ))
                                ) : (
                                    <></>
                                )}
                            </Table.Body>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}

InventarioProductoPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
