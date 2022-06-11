import { PlantaMinera, Usuario } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(
    async (
        req: NextApiRequest,
        res: NextApiResponse<
            | (PlantaMinera & {
                  Usuario: Usuario | null;
              })[]
            | PlantaMinera
            | ErrorMessage
        >,
    ) => {
        try {
            switch (req.method) {
                case 'GET':
                    const plantas = await prisma.plantaMinera.findMany({
                        include: {
                            Usuario: true,
                        },
                        where: { active: true },
                    });
                    res.status(HTTP_CODES.OK).json(plantas);
                    break;
                case 'POST':
                    const { direccion, nombre, encargado, idGiroNegocio } = req.body as PlantaMinera;
                    const plantaMinera = await prisma.plantaMinera.create({
                        data: { direccion, nombre, encargado, idGiroNegocio },
                    });
                    res.status(HTTP_CODES.CREATED).json(plantaMinera);
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
