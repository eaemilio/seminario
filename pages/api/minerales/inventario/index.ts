import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { ErrorMessage } from '../../types';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../../constants';
import { InventarioMineral } from '@prisma/client';

export default withApiAuth(
    async (req: NextApiRequest, res: NextApiResponse<InventarioMineral[] | InventarioMineral | ErrorMessage>) => {
        const {
            query: { idPlantaMinera, idMineral },
        } = req;
        try {
            switch (req.method) {
                case 'GET':
                    const inventario = await prisma.inventarioMineral.findMany({
                        where: {
                            PlantaMinera: {
                                id: {
                                    equals: idPlantaMinera ? +idPlantaMinera : undefined,
                                },
                            },
                            Mineral: {
                                id: {
                                    equals: idMineral ? +idMineral : undefined,
                                },
                            },
                        },
                        include: {
                            Mineral: true,
                        },
                    });
                    res.status(HTTP_CODES.OK).json(inventario);
                    break;
                case 'PUT':
                    const { cantidad } = req.body as InventarioMineral;
                    const updated = await prisma.inventarioMineral.update({
                        where: {
                            idPlantaMinera_idMineral: {
                                idMineral: +idMineral,
                                idPlantaMinera: +idPlantaMinera,
                            },
                        },
                        data: {
                            cantidad,
                        },
                        include: {
                            Mineral: true,
                        },
                    });
                    res.status(HTTP_CODES.OK).json(updated);
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
