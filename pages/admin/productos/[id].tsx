import { Producto } from '@prisma/client';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import useSWR from 'swr';
import ProductView from '../../../components/productos/ProductView';
import ApiGateway from '../../../services/api-gateway';
import AdminLayout from '../layout/AdminLayout';

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const { data: product } = useSWR<Producto | undefined>(['/api/productos', id], ApiGateway.fetchUnique);
    return <ProductView product={product}></ProductView>;
}

EditProduct.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
