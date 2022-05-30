import { Mineral } from '@prisma/client';
import axios from 'axios';

export const fetchMinerales = async (url: string): Promise<Mineral[]> => {
    try {
        const minerales = await axios.get(url);
        return minerales.data ?? [];
    } catch (error) {
        return [];
    }
};

export const createMineral = async (url: string, mineral: Mineral): Promise<Mineral> => {
    const newMineral = await axios.post<Mineral>(url, mineral);
    return mineral;
};

export const fetchMineral = async (url: string, id: string): Promise<Mineral> => {
    const mineral = await axios.get<Mineral>(`${url}/${id}`);
    return mineral.data;
};

export const updatePlantaMinera = async (url: string, update: Partial<Mineral>): Promise<Mineral> => {
    const mineral = await axios.put<Mineral>(`${url}`, update);
    return mineral.data;
};
