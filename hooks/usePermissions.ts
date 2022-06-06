import { Permiso } from '@prisma/client';
import { Rol } from '@prisma/client';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import useRequest from '../utils/useRequest';

export default function usePermissions() {
    const { user } = useUser();
    const { data: permissions } = useRequest<(Permiso & { Rol: Rol })[]>(
        user ? { url: `/api/permisos/${user.id}` } : null,
    );

    const hasAccess = (id: number): boolean => {
        return !!permissions?.find((p) => p.idGiroNegocio === id);
    };

    const canUpdate = (id: number): boolean => {
        return !!permissions?.find((p) => p.idGiroNegocio === id && p.Rol.canUpdate);
    };

    const canCreate = (id: number): boolean => {
        return !!permissions?.find((p) => p.idGiroNegocio === id && p.Rol.canCreate);
    };

    const canDelete = (id: number): boolean => {
        return !!permissions?.find((p) => p.idGiroNegocio === id && p.Rol.canDelete);
    };

    return { permissions, hasAccess, canUpdate, canCreate, canDelete };
}
