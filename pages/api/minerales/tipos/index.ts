import { Mineral, PlantaMinera, Usuario } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Mineral[] | Mineral | ErrorMessage>) => {
    try {
        switch (req.method) {
            case 'GET':
                const minerales = await prisma.mineral.findMany({
                    where: { active: true },
                });
                res.status(HTTP_CODES.OK).json(minerales);
                break;
            case 'POST':
                const { nombre, descripcion, precioUnidad, unidadMedida } = req.body as Mineral;
                const mineral = await prisma.mineral.create({
                    data: { nombre, descripcion, precioUnidad: +precioUnidad, unidadMedida },
                });
                res.status(HTTP_CODES.CREATED).json(mineral);
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
