import { InventarioProducto } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(
    async (req: NextApiRequest, res: NextApiResponse<InventarioProducto[] | InventarioProducto | ErrorMessage>) => {
        const {
            query: { idPlantaProcesado, idProducto },
        } = req;
        try {
            switch (req.method) {
                case 'GET':
                    const inventario = await prisma.inventarioProducto.findMany({
                        where: {
                            PlantaProcesado: {
                                id: {
                                    equals: idPlantaProcesado ? +idPlantaProcesado : undefined,
                                },
                            },
                            Producto: {
                                id: {
                                    equals: idProducto ? +idProducto : undefined,
                                },
                            },
                        },
                        include: {
                            Producto: true,
                        },
                    });
                    res.status(HTTP_CODES.OK).json(inventario);
                    break;
                case 'PUT':
                    const { cantidad } = req.body as InventarioProducto;
                    console.log(idPlantaProcesado, idProducto);
                    const updated = await prisma.inventarioProducto.update({
                        where: {
                            idPlantaProcesado_idProducto: {
                                idPlantaProcesado: +idPlantaProcesado,
                                idProducto: +idProducto,
                            },
                        },
                        data: {
                            cantidad,
                        },
                        include: {
                            Producto: true,
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
