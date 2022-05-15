import type { AppProps } from 'next/app';
import { UserProvider } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
// import '../styles/globals.css';
import { NextUIProvider } from '@nextui-org/react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <NextUIProvider>
            <UserProvider supabaseClient={supabaseClient}>
                <Component {...pageProps} />
            </UserProvider>
        </NextUIProvider>
    );
}

export default MyApp;
