import { PlantaProcesado } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(
    async (req: NextApiRequest, res: NextApiResponse<PlantaProcesado[] | PlantaProcesado | ErrorMessage>) => {
        try {
            switch (req.method) {
                case 'GET':
                    const plantas = await prisma.plantaProcesado.findMany({
                        where: { active: true },
                        include: {
                            Usuario: true,
                        },
                    });
                    res.status(HTTP_CODES.OK).json(plantas);
                    break;
                case 'POST':
                    const { nombre, ubicacion, telefono, idGiroNegocio = 2, encargado } = req.body as PlantaProcesado;
                    console.log(encargado);
                    const plantaProcesado = await prisma.plantaProcesado.create({
                        data: { ubicacion, nombre, telefono, idGiroNegocio, encargado },
                    });
                    res.status(HTTP_CODES.CREATED).json(plantaProcesado);
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
