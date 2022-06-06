import { Button, Table } from '@nextui-org/react';
import { PedidoMineral } from '@prisma/client';
import Link from 'next/link';
import { ReactElement } from 'react';
import useSWR from 'swr';
import ApiGateway from '../../../../services/api-gateway';
import AdminLayout from '../../layout/AdminLayout';

export default function PedidosMineralesView() {
    const { data: pedidos, error } = useSWR<PedidoMineral[]>('/api/minerales/pedidos', ApiGateway.fetchAll);

    return (
        <div>
            <h2 className="mb-10">Pedidos de Materia Prima</h2>
            <div className="flex flex-col">
                <div className="flex justify-end items-center mb-4">
                    <Link href="pedidos/new">
                        <Button>Nuevo Pedido</Button>
                    </Link>
                </div>
                <div className="w-full h-fit relative">
                    <Table
                        aria-label="Example table with static content"
                        css={{
                            height: 'auto',
                            minWidth: '100%',
                        }}
                        striped={true}
                    >
                        <Table.Header>
                            <Table.Column>Cliente</Table.Column>
                            <Table.Column>NIT</Table.Column>
                            <Table.Column>Notas</Table.Column>
                            <Table.Column>Sub Total</Table.Column>
                            <Table.Column>IVA</Table.Column>
                            <Table.Column>Total</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {error && <></>}
                            {pedidos?.map((d) => (
                                <Table.Row key={d.id}>
                                    <Table.Cell>{d.nombreCliente}</Table.Cell>
                                    <Table.Cell>{d.nit}</Table.Cell>
                                    <Table.Cell>{d.notas}</Table.Cell>
                                    <Table.Cell>Q. {d.subTotal}</Table.Cell>
                                    <Table.Cell>Q. {d.impuestos}</Table.Cell>
                                    <Table.Cell>Q. {d.total}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
}

PedidosMineralesView.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
