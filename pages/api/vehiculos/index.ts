import { VehiculoTransporte } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../constants';
import { ErrorMessage } from '../types';

export default withApiAuth(
    async (req: NextApiRequest, res: NextApiResponse<VehiculoTransporte[] | VehiculoTransporte | ErrorMessage>) => {
        try {
            switch (req.method) {
                case 'POST':
                    const data = req.body as VehiculoTransporte;
                    const vehiculo = await prisma.vehiculoTransporte.create({ data });
                    res.status(HTTP_CODES.CREATED).json(vehiculo);
                    break;
                case 'GET':
                    const vehiculos = await prisma.vehiculoTransporte.findMany();
                    res.status(HTTP_CODES.OK).json(vehiculos);
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
