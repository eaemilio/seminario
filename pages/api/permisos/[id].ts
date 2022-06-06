import { Permiso } from '@prisma/client';
import { supabaseClient, withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../constants';
import { ErrorMessage } from '../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Permiso[] | ErrorMessage>) => {
    const { id } = req.query as { id: string };
    if (!id) {
        res.status(HTTP_CODES.NOT_FOUND);
        return;
    }
    try {
        switch (req.method) {
            case 'GET':
                const permisos = await prisma.permiso.findMany({
                    where: {
                        Usuario: {
                            id: id,
                        },
                    },
                    include: {
                        Rol: true,
                    },
                });
                res.status(HTTP_CODES.OK).json(permisos);
                break;
            default:
                res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                break;
        }
    } catch (error) {
        console.log(`error` + error);
        res.status(HTTP_CODES.SERVER_ERROR).json({ error });
    }
});
