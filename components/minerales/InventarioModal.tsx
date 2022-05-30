import { Button, Input, Modal, Text, Loading } from '@nextui-org/react';
import { InventarioMineral, Mineral } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ApiGateway from '../../services/api-gateway';
import { updateInventarioQuantity } from '../../services/minerales/inventario';
import useRequest from '../../utils/useRequest';

interface InventarioModalProps {
    visible: boolean;
    closeHandler: () => void;
    onSaveHandler: (updated: InventarioMineral & { Mineral: Mineral }) => void;
    idMineral: number;
    idPlantaMinera: number;
}

export default function InventarioModal({
    visible,
    closeHandler,
    onSaveHandler,
    idMineral,
    idPlantaMinera,
}: InventarioModalProps) {
    const [cantidad, setCantidad] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data, error } = useRequest<(InventarioMineral & { Mineral: Mineral })[]>(
        idPlantaMinera
            ? {
                  url: '/api/minerales/inventario',
                  params: {
                      idPlantaMinera,
                      idMineral,
                  },
              }
            : null,
    );

    const onSave = async () => {
        try {
            setIsLoading(true);
            const updated = await updateInventarioQuantity<InventarioMineral & { Mineral: Mineral }>(
                { cantidad: (data?.[0].cantidad ?? 0) + cantidad },
                { idPlantaMinera, idMineral },
            );
            onSaveHandler(updated);
            setCantidad(0);
        } catch (error) {
            toast.error('Ocurrió un error, vuelve a intentarlo.');
            closeHandler();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal closeButton blur aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
            <Modal.Header>
                <Text id="modal-title" size={18}>
                    <Text b size={18}>
                        Información de Mineral
                    </Text>
                </Text>
            </Modal.Header>
            <Modal.Body>
                {!data && !error ? (
                    <></>
                ) : (
                    data && (
                        <div className="flex flex-col gap-10">
                            <table>
                                <thead></thead>
                                <tbody>
                                    <tr className="align-top">
                                        <th>
                                            <Text b>Mineral</Text>
                                        </th>
                                        <th className="">
                                            <Text>{data[0].Mineral.nombre}</Text>
                                        </th>
                                    </tr>
                                    <tr className="align-top">
                                        <th>
                                            <Text b>Descripción</Text>
                                        </th>
                                        <th className="">
                                            <Text>{data[0].Mineral.descripcion}</Text>
                                        </th>
                                    </tr>
                                    <tr className="align-top">
                                        <th>
                                            <Text b>Precio Unitario</Text>
                                        </th>
                                        <th className="">
                                            <Text>Q. {data[0].Mineral.precioUnidad}</Text>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                            <Input
                                label="Añadir existencias:"
                                placeholder="200"
                                type="number"
                                labelRight={data[0].Mineral.unidadMedida ?? ''}
                                onChange={(e) => setCantidad(+e.target.value)}
                            />
                            <Text color="warning" className="mb-10" size={14}>
                                Cantidad después de guardar el cambio: {(data?.[0].cantidad ?? 0) + cantidad}
                            </Text>
                        </div>
                    )
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button auto flat color="error" onClick={closeHandler}>
                    Cerrar
                </Button>
                <Button
                    auto
                    flat
                    onClick={onSave}
                    disabled={!cantidad || isLoading}
                    iconRight={isLoading && <Loading type="points-opacity" color="currentColor" size="lg" />}
                >
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
