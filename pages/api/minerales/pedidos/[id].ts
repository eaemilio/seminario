import { DetallePedidoMineral, PedidoMineral } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<PedidoMineral | ErrorMessage>) => {
    try {
        const { id } = req.query as { id: string };
        switch (req.method) {
            case 'GET':
                const pedido = await prisma.pedidoMineral.findUnique({
                    where: { id: +id },
                    include: {
                        DetallePedidoMineral: true,
                    },
                });
                if (pedido) {
                    return res.status(200).json(pedido);
                }
                return res.status(404).json(NOT_FOUND_ERROR);
                break;
            default:
                res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                break;
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_CODES.SERVER_ERROR).json({ error });
    }
});
