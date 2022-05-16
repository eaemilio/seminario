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

    if (!user)
        return (
            <div className={styles.loginContainer}>
                <Card hoverable css={{ mw: '400px' }}>
                    <Auth supabaseClient={supabaseClient} />
                </Card>
            </div>
        );

    return (
        <>
            <Button onClick={() => supabaseClient.auth.signOut()}>Sign out</Button>
            <p>user:</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
    );
}
