import { DetallePedidoMineral, PedidoMineral } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(
    async (req: NextApiRequest, res: NextApiResponse<PedidoMineral[] | PedidoMineral | ErrorMessage>) => {
        try {
            switch (req.method) {
                case 'GET':
                    const pedidos = await prisma.pedidoMineral.findMany();
                    res.status(HTTP_CODES.OK).json(pedidos);
                    break;
                case 'POST':
                    const {
                        createdBy,
                        idPlantaMinera,
                        impuestos,
                        nit,
                        nombreCliente,
                        notas,
                        subTotal,
                        total,
                        detalle,
                    } = req.body as PedidoMineral & { detalle: DetallePedidoMineral[] };
                    const pedido = await prisma.pedidoMineral.create({
                        data: {
                            createdBy,
                            idPlantaMinera,
                            impuestos,
                            nit,
                            nombreCliente,
                            notas,
                            subTotal,
                            total,
                            DetallePedidoMineral: {
                                create: [...detalle],
                            },
                        },
                    });
                    res.status(HTTP_CODES.CREATED).json(pedido);
                    break;
                default:
                    res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                    break;
            }
        } catch (error) {
            console.log(error);
            res.status(HTTP_CODES.SERVER_ERROR).json({ error });
        }
    },
);
