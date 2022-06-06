import { ReactElement } from 'react';
import ProductView from '../../../components/productos/ProductView';
import AdminLayout from '../layout/AdminLayout';

export default function NewProducto() {
    return <ProductView></ProductView>;
}

NewProducto.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
