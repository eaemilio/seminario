import { Table, Text } from '@nextui-org/react';
import { InventarioMineral, Mineral, PlantaMinera } from '@prisma/client';
import React, { ReactElement, useState } from 'react';
import useSWR from 'swr';
import Loading from '../../../../components/Loading';
import ApiGateway from '../../../../services/api-gateway';
import AdminLayout from '../../layout/AdminLayout';
import InventarioModal from '../../../../components/minerales/InventarioModal';
import { getAllInventario } from '../../../../services/minerales/inventario';

export default function InventarioMineralPage() {
    const [visible, setVisible] = useState(false);
    const [idPlantaMinera, setIdPlantaMinera] = useState<number>(0);
    const [idMineral, setIdMineral] = useState<number | null>(null);

    const { data: plantas } = useSWR<PlantaMinera[]>('/api/minerales/plantas', ApiGateway.fetchAll);
    const {
        data: inventario,
        isValidating,
        mutate,
    } = useSWR<(InventarioMineral & { Mineral: Mineral })[]>(
        ['/api/minerales/inventario', idPlantaMinera],
        getAllInventario,
    );

    const closeHandler = () => {
        setVisible(false);
    };

    const onSaveHandler = (updated: InventarioMineral & { Mineral: Mineral }) => {
        const filtered = inventario?.filter(
            (i) => i.idMineral !== updated.idMineral && i.idPlantaMinera !== updated.idPlantaMinera,
        );
        mutate([...(filtered ?? []), updated]);
        setVisible(false);
    };

    const plantaMineraOnChange = (id: number) => {
        setIdPlantaMinera(id);
    };

    const handleRowClick = (e: 'all' | Set<React.Key>) => {
        if (e === 'all') {
            return;
        }
        e.forEach((item) => setIdMineral(+item));
        setVisible(!visible);
    };

    return (
        <div>
            {idMineral && (
                <InventarioModal
                    visible={visible}
                    closeHandler={closeHandler}
                    onSaveHandler={onSaveHandler}
                    idMineral={idMineral}
                    idPlantaMinera={idPlantaMinera}
                />
            )}
            <h2 className="mb-10">Inventario de Materia Prima</h2>
            <Text size={12} className="mb-4">
                Selecciona una planta de extracción minera para ver su inventario
            </Text>
            <div className="flex flex-col gap-2">
                <label htmlFor="plantaMinera" className="block text-sm font-medium text-gray-900 dark:text-gray-400">
                    Planta Minera
                </label>
                <select
                    id="plantaMinera"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                    onChange={(e) => plantaMineraOnChange(+e.target.value)}
                >
                    <option key="initial" value={0}>
                        Selecciona una Planta de Extracción Minera
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
                                <Table.Column>Mineral</Table.Column>
                                <Table.Column>Descripción</Table.Column>
                                <Table.Column>Precio Unitario</Table.Column>
                                <Table.Column>Unidades</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {inventario ? (
                                    inventario
                                        .sort((a, b) => a.Mineral.id - b.Mineral.id)
                                        .map((item) => (
                                            <Table.Row key={item.Mineral.id}>
                                                <Table.Cell>{item.Mineral.nombre}</Table.Cell>
                                                <Table.Cell>{item.Mineral.descripcion}</Table.Cell>
                                                <Table.Cell>{item.Mineral.precioUnidad}</Table.Cell>
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

InventarioMineralPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
