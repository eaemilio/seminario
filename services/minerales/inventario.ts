import { InventarioMineral, Mineral } from '@prisma/client';
import axios from 'axios';

export const updateInventarioQuantity = async <T>(
    data: Partial<InventarioMineral>,
    params: { idPlantaMinera: number; idMineral: number },
): Promise<T> => {
    const updated = await axios.put<T>('/api/minerales/inventario', data, {
        params,
    });
    return updated.data;
};

export const getAllInventario = async <T>(url: string, idPlantaMinera: number): Promise<T> => {
    const result = await axios.get<T>(url, { params: { idPlantaMinera } });
    return result.data;
};
