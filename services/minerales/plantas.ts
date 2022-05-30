import { PlantaMinera, Usuario } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

export const fetchPlantasMineras = async (
    url: string,
): Promise<
    (PlantaMinera & {
        Usuario: Usuario | null;
    })[]
> => {
    try {
        const plantas = await axios.get(url);
        return plantas.data ?? [];
    } catch (error) {
        return [];
    }
};

export const createPlantaMinera = async (
    url: string,
    planta: PlantaMinera,
): Promise<AxiosResponse<PlantaMinera, any>> => {
    const newPlanta = await axios.post<PlantaMinera>(url, planta);
    return newPlanta;
};

export const fetchPlantaMinera = async (url: string, id: string): Promise<PlantaMinera> => {
    const planta = await axios.get<PlantaMinera>(`${url}/${id}`);
    return planta.data;
};

export const updatePlantaMinera = async (url: string, update: Partial<PlantaMinera>): Promise<PlantaMinera> => {
    const planta = await axios.put<PlantaMinera>(`${url}`, update);
    return planta.data;
};
