import { useUser } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { Auth } from '@supabase/ui';
import { Button, Card } from '@nextui-org/react';
import styles from '../../styles/Login.module.scss';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/admin');
        }
    }, [user, router]);

    return (
        <div className={styles.loginContainer}>
            <Card hoverable css={{ mw: '400px' }}>
                <Auth supabaseClient={supabaseClient} />
            </Card>
        </div>
    );
}
