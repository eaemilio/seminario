import { Mineral, PlantaMinera, Usuario } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Mineral | ErrorMessage>) => {
    try {
        const { id } = req.query as { id: string };
        switch (req.method) {
            case 'GET':
                const mineral = await prisma.mineral.findUnique({
                    where: { id: +id },
                });
                if (mineral) {
                    return res.status(200).json(mineral);
                }
                return res.status(404).json(NOT_FOUND_ERROR);
            case 'PUT':
                const { nombre, descripcion, precioUnidad, unidadMedida, active } = req.body as Mineral;
                const mineralUpdate = await prisma.mineral.update({
                    where: { id: +id },
                    data: { nombre, descripcion, precioUnidad: +precioUnidad, unidadMedida, active },
                });
                return res.status(200).json(mineralUpdate);
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
