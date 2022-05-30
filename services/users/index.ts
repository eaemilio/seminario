import { GiroNegocio, Usuario } from '@prisma/client';
import axios from 'axios';

export const fetchUser = async (url: string, id?: string): Promise<GiroNegocio[]> => {
    if (!id) {
        return [];
    }
    const user = await axios.get(`${url}/${id}`);
    return [];
};

export const fetchUsers = async (url: string, idRol?: number, idGiroNegocio?: number): Promise<Usuario[]> => {
    const users = await axios.get<Usuario[]>(url, {
        params: {
            idRol,
            idGiroNegocio,
        },
    });
    return users.data;
};
