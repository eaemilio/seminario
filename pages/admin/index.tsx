import { Button } from '@nextui-org/react';
import { ReactElement } from 'react';
import AdminLayout from './layout/AdminLayout';

export default function Admin() {
    return (
        <div>
            <h2>Dashboard</h2>
        </div>
    );
}

Admin.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
