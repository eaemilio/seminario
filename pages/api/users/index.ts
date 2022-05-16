import { Usuario } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../constants';
import { ErrorMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Usuario[] | Usuario | ErrorMessage>) => {
    try {
        switch (req.method) {
            case 'POST':
                const { correo, nombre, activo = true, idRol } = req.body as Usuario;
                const id = uuidv4();
                const user = await prisma.usuario.create({ data: { correo, id, nombre, activo, idRol } });
                res.status(HTTP_CODES.CREATED).json(user);
                break;
            case 'GET':
                const users = await prisma.usuario.findMany();
                res.status(HTTP_CODES.OK).json(users);
                break;
            default:
                res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                break;
        }
    } catch (error) {
        res.status(HTTP_CODES.SERVER_ERROR).json({ error });
    }
});
