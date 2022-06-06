import { PlantaProcesado } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<PlantaProcesado | ErrorMessage>) => {
    try {
        const { id } = req.query as { id: string };
        switch (req.method) {
            case 'GET':
                const planta = await prisma.plantaProcesado.findUnique({
                    where: { id: +id },
                    include: {
                        Usuario: true,
                    },
                });
                if (planta) {
                    return res.status(200).json(planta);
                }
                return res.status(404).json(NOT_FOUND_ERROR);
            case 'PUT':
                const { ubicacion, telefono, nombre, active } = req.body as PlantaProcesado;
                const plantaUpdate = await prisma.plantaProcesado.update({
                    where: { id: +id },
                    data: {
                        ubicacion,
                        telefono,
                        nombre,
                        active,
                    },
                });
                return res.status(200).json(plantaUpdate);
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
