import { Button, Input, Modal, Text, Loading, FormElement, Textarea, Divider } from '@nextui-org/react';
import { DetallePedidoMineral, InventarioMineral, Mineral } from '@prisma/client';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ApiGateway from '../../services/api-gateway';

interface DetallePedidoModalProps {
    visible: boolean;
    closeHandler: () => void;
    onSaveHandler: (detalle: DetallePedidoMineral) => void;
    idPlantaMinera: number;
}

export default function DetallePedidoModal({
    visible,
    closeHandler,
    onSaveHandler,
    idPlantaMinera,
}: DetallePedidoModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        reset,
    } = useForm<DetallePedidoMineral>();
    const [mineral, setMineral] = useState<(InventarioMineral & { Mineral: Mineral | null }) | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!visible) {
            reset();
            setMineral(null);
        }
    }, [visible, reset]);

    const searchMineral = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const { idMineral } = getValues();
            const result = await await axios.get<(InventarioMineral & { Mineral: Mineral | null })[]>(
                '/api/minerales/inventario',
                {
                    params: {
                        idPlantaMinera,
                        idMineral,
                    },
                },
            );
            setMineral(result.data[0]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCantidadChange = (e: ChangeEvent<FormElement>): void => {
        const { value } = e.target;
        setValue('subTotal', +value * (mineral?.Mineral?.precioUnidad ?? 0));
    };

    const onSubmit = (data: DetallePedidoMineral) => {
        if (!mineral) {
            return;
        }
        console.log(data);
        onSaveHandler(data);
    };

    return (
        <Modal closeButton blur aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        <Text b size={18}>
                            Materia Prima
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Código de Mineral"
                            placeholder="2789"
                            type="number"
                            color={errors.idMineral ? 'error' : 'default'}
                            {...register('idMineral', { required: true, valueAsNumber: true })}
                            onChange={() => setMineral(null)}
                        />
                        {!mineral && (
                            <Text color="error" size={10}>
                                Mineral No Encontrado
                            </Text>
                        )}
                        <Button
                            auto
                            flat
                            onClick={() => searchMineral()}
                            iconRight={isLoading && <Loading type="points-opacity" color="currentColor" size="lg" />}
                            disabled={!!mineral}
                        >
                            Buscar
                        </Button>
                        {mineral && (
                            <div className="flex flex-col gap-4">
                                <Divider></Divider>
                                <Text h4>{mineral.Mineral?.nombre}</Text>
                                <Text size={12}>{mineral.Mineral?.descripcion}</Text>
                                <Divider></Divider>
                                <Input
                                    label={`Cantidad (Existencias: ${mineral.cantidad})`}
                                    placeholder="10"
                                    type="number"
                                    color={errors.cantidad ? 'error' : 'default'}
                                    {...register('cantidad', {
                                        required: true,
                                        max: mineral.cantidad ?? 0,
                                        valueAsNumber: true,
                                    })}
                                    onChange={handleCantidadChange}
                                />
                                <Input
                                    label="Sub total"
                                    type="number"
                                    disabled
                                    {...register('subTotal')}
                                    labelLeft="Q."
                                    className="mb-8"
                                />
                                <Textarea labelPlaceholder="Notas" {...register('nota')} />
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Cerrar
                    </Button>
                    <Button auto flat type="submit" disabled={Object.keys(errors).length !== 0 || !mineral}>
                        Agregar Materia Prima
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
