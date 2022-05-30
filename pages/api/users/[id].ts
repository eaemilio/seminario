import { Usuario } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../constants';
import { ErrorMessage } from '../types';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Usuario | ErrorMessage>) => {
    try {
        const { id } = req.query as { id: string };
        switch (req.method) {
            case 'GET':
                const user = await prisma.usuario.findUnique({
                    where: { id },
                });
                if (user) {
                    return res.status(200).json(user);
                }
                res.status(404).json(NOT_FOUND_ERROR);
                break;
            case 'PUT':
                const { correo, nombre, activo } = req.body as Usuario;
                const userUpdate = await prisma.usuario.update({
                    where: { id },
                    data: {
                        correo,
                        nombre,
                        activo,
                    },
                });
                res.status(200).json(userUpdate);
                break;
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
