import { Producto } from '@prisma/client';
import { withApiAuth } from '@supabase/supabase-auth-helpers/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { slugify } from '../../../utils/helper';
import prisma from '../../../utils/prisma';
import { HTTP_CODES, METHOD_NOT_ALLOWED_ERROR, OPTIONS, VARIANTS } from '../../constants';
import { ErrorMessage } from '../types';

export default withApiAuth(async (req: NextApiRequest, res: NextApiResponse<Producto[] | Producto | ErrorMessage>) => {
    try {
        switch (req.method) {
            case 'GET':
                const productos = await prisma.producto.findMany();
                res.status(HTTP_CODES.OK).json(productos);
                break;
            case 'POST':
                const {
                    name,
                    vendor = 'seminario',
                    descriptionHtml,
                    images,
                    price,
                    options = OPTIONS,
                    variants = VARIANTS,
                } = req.body as Producto;
                const _price = JSON.parse(JSON.stringify(price));
                const slug = slugify(name);
                const path = `/${slug}`;
                const producto = await prisma.producto.create({
                    data: { name, vendor, descriptionHtml, images, price: _price, slug, path, variants, options },
                });
                res.status(HTTP_CODES.CREATED).json(producto);
                break;
            default:
                res.status(HTTP_CODES.METHOD_NOT_ALLOWED).json(METHOD_NOT_ALLOWED_ERROR);
                break;
        }
    } catch (error) {
        console.log(error);
        res.status(HTTP_CODES.SERVER_ERROR).json({ error });
    }
});
