import { Divider } from '@nextui-org/react';
import { Tabs } from '@supabase/ui';
import { ReactElement } from 'react';
import Vehiculos from '../../../components/settings/Vehiculos';
import AdminLayout from '../layout/AdminLayout';

export default function Settings() {
    return (
        <Tabs>
            <Tabs.Panel id="one" label="Usuarios">
                <Divider className="mb-8" />
            </Tabs.Panel>
            <Tabs.Panel id="two" label="Vehículos de Transporte">
                <Divider className="mb-8" />
                <Vehiculos />
            </Tabs.Panel>
        </Tabs>
    );
}
Settings.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
