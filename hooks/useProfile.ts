import { Usuario } from '@prisma/client';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import useSWR from 'swr';
import ApiGateway from '../services/api-gateway';
import useRequest from '../utils/useRequest';

export default function useProfile() {
    const { user } = useUser();
    const { data: profile } = useRequest<Usuario>(user ? { url: `/api/users/${user.id}` } : null);
    return { profile };
}
