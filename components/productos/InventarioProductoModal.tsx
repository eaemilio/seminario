import { Button, Input, Loading, Modal, Text } from '@nextui-org/react';
import { InventarioProducto, Producto } from '@prisma/client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateInventarioQuantity } from '../../services/productos/inventario';
import useRequest from '../../utils/useRequest';

interface InventarioModalProps {
    visible: boolean;
    closeHandler: () => void;
    onSaveHandler: (updated: InventarioProducto & { Producto: Producto }) => void;
    idProducto: number;
    idPlantaProcesado: number;
}

export default function InventarioModal({
    visible,
    closeHandler,
    onSaveHandler,
    idPlantaProcesado,
    idProducto,
}: InventarioModalProps) {
    const [cantidad, setCantidad] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data, error } = useRequest<(InventarioProducto & { Producto: Producto })[]>(
        idPlantaProcesado
            ? {
                  url: '/api/productos/inventario',
                  params: {
                      idPlantaProcesado,
                      idProducto,
                  },
              }
            : null,
    );

    const onSave = async () => {
        try {
            setIsLoading(true);
            const updated = await updateInventarioQuantity<InventarioProducto & { Producto: Producto }>(
                { cantidad: (data?.[0].cantidad ?? 0) + cantidad },
                { idPlantaProcesado, idProducto },
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
                        Información de Producto
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
                                            <Text b>Producto</Text>
                                        </th>
                                        <th className="">
                                            <Text>{data[0].Producto.name}</Text>
                                        </th>
                                    </tr>
                                    <tr className="align-top">
                                        <th>
                                            <Text b>Descripción</Text>
                                        </th>
                                        <th className="">
                                            <Text>{data[0].Producto.descriptionHtml}</Text>
                                        </th>
                                    </tr>
                                    <tr className="align-top">
                                        <th>
                                            <Text b>Precio Unitario</Text>
                                        </th>
                                        <th className="">
                                            <Text>Q. {(data[0].Producto.price as { value: number }).value}</Text>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                            <Input
                                label="Añadir existencias:"
                                placeholder="200"
                                type="number"
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
