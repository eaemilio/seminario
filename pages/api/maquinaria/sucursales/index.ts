import { SucursalMaquinaria } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../../../constants';
import { ErrorMessage } from '../../types';

export default withApiAuth(
    async (req: NextApiRequest, res: NextApiResponse<SucursalMaquinaria[] | SucursalMaquinaria | ErrorMessage>) => {
        try {
            switch (req.method) {
                case 'GET':
                    const sucursales = await prisma.sucursalMaquinaria.findMany();
                    res.status(HTTP_CODES.OK).json(sucursales);
                    break;
                case 'POST':
                    const { nombre, idGiroNegocio, ubicacion, telefono } = req.body as SucursalMaquinaria;
                    const sucursalMaquinaria = await prisma.sucursalMaquinaria.create({
                        data: { nombre, ubicacion, idGiroNegocio, telefono },
                    });
                    res.status(HTTP_CODES.CREATED).json(sucursalMaquinaria);
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
