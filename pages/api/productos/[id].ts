import { Producto } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { slugify } from '../../../utils/helper';
import prisma from '../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, NOT_FOUND_ERROR } from '../../../constants';
import { ErrorMessage } from '../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Producto | ErrorMessage>) => {
    try {
        const { id } = req.query as { id: string };
        switch (req.method) {
            case 'GET':
                const product = await prisma.producto.findUnique({
                    where: { id: +id },
                });
                if (product) {
                    return res.status(200).json(product);
                }
                return res.status(404).json(NOT_FOUND_ERROR);
            case 'PUT':
                const { name, descriptionHtml, images, price } = req.body as Producto;
                const _price = JSON.parse(JSON.stringify(price));
                const slug = slugify(name);
                const path = `/${slug}`;
                const productoUpdated = await prisma.producto.update({
                    data: { name, descriptionHtml, images, price: _price, slug, path },
                    where: {
                        id: +id,
                    },
                });
                res.status(200).json(productoUpdated);
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
