import { InventarioMineral, InventarioProducto, Mineral } from '@prisma/client';
import axios from 'axios';

export const updateInventarioQuantity = async <T>(
    data: Partial<InventarioProducto>,
    params: { idPlantaProcesado: number; idProducto: number },
): Promise<T> => {
    const updated = await axios.put<T>('/api/productos/inventario', data, {
        params,
    });
    return updated.data;
};

export const getAllInventario = async <T>(url: string, idPlantaProcesado: number): Promise<T> => {
    const result = await axios.get<T>(url, { params: { idPlantaProcesado } });
    return result.data;
};
