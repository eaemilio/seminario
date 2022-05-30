import { ReactElement } from 'react';
import AdminLayout from '../../layout/AdminLayout';

export default function PedidosMineralesView() {}

PedidosMineralesView.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
