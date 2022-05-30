import axios from 'axios';

export default class ApiGateway {
    public static fetchAll = async <T>(url: string, ...params: any): Promise<T[]> => {
        try {
            const all = await axios.get<T[]>(url, {
                params: {
                    ...params,
                },
            });
            return all.data;
        } catch {
            return [];
        }
    };

    public static create = async <T>(url: string, data: T): Promise<T | undefined> => {
        try {
            const created = await axios.post<T>(url, data);
            return created.data;
        } catch {
            return undefined;
        }
    };

    public static fetchUnique = async <T>(url: string, id: string): Promise<T | undefined> => {
        try {
            const unique = await axios.get<T>(`${url}/${id}`);
            return unique.data;
        } catch {
            return undefined;
        }
    };

    public static updateData = async <T>(url: string, update: Partial<T>): Promise<T> => {
        const updated = await axios.put<T>(`${url}`, update);
        return updated.data;
    };
}
