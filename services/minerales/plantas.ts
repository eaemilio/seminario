import { PlantaMinera, Usuario } from '@prisma/client';
import axios from 'axios';

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
