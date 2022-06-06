import { Permiso } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR } from '../../constants';
import { ErrorMessage } from '../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Permiso[] | ErrorMessage>) => {
    const { id } = req.query as { id: string };
    try {
        switch (req.method) {
            default:
                res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                break;
        }
    } catch (error) {
        console.log(`error` + error);
        res.status(HTTP_CODES.SERVER_ERROR).json({ error });
    }
});
