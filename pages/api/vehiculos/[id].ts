import { VehiculoTransporte } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../constants';
import { ErrorMessage } from '../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<VehiculoTransporte | ErrorMessage>) => {
    try {
        const { id } = req.query as { id: string };
        switch (req.method) {
            case 'GET':
                const vehiculo = await prisma.vehiculoTransporte.findUnique({
                    where: { id: +id },
                });
                if (vehiculo) {
                    return res.status(200).json(vehiculo);
                }
                res.status(404).json(NOT_FOUND_ERROR);
                break;
            case 'PUT':
                const data = req.body as VehiculoTransporte;
                const update = await prisma.vehiculoTransporte.update({
                    where: { id: +id },
                    data,
                });
                res.status(200).json(update);
                break;
            default:
                res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                break;
        }
    } catch (error) {
        if ((error as any).code === 'P2025') {
            res.status(HTTP_CODES.NOT_FOUND).json({ error });
        } else {
            res.status(HTTP_CODES.SERVER_ERROR).json({ error });
        }
    }
});
