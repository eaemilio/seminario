import { Button, Card, Input, Loading, Text, Textarea } from '@nextui-org/react';
import { Producto } from '@prisma/client';
import { IconArrowLeft } from '@supabase/ui';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from '../../pages/constants';
import ApiGateway from '../../services/api-gateway';
import { notNil, slugify } from '../../utils/helper';
import { supabase } from '../../utils/supabase';
import RequiredTextError from '../RequiredText';

export default function ProductView({ product }: { product?: Producto }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const [gallery, setGallery] = useState<(File | null)[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setIsLoading(true);
            // First, save the images

            let index = 0;
            const images: string[] = [];
            const productName = getValues('name');
            for (const image of gallery.filter(notNil)) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${index}.${fileExt}`;
                const slug = slugify(productName);
                const filePath = `${slug}/${fileName}`;

                const { error: uploadError, data: uploaded } = await supabase.storage
                    .from('products')
                    .upload(filePath, image);

                if (uploadError) {
                    throw uploadError;
                }
                if (uploaded) {
                    images.push(uploaded.Key);
                }
                index++;
            }

            const { name, precio, currencyCode, descriptionHtml } = data as Producto & {
                precio: string;
                currencyCode: string;
            };
            // then, save the product
            if (!product) {
                await ApiGateway.create<Partial<Producto>>('/api/productos', {
                    name,
                    price: {
                        value: +precio,
                        currencyCode,
                    },
                    descriptionHtml,
                    images: images.map((url) => ({
                        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${url}`,
                        altText: `${productName} image - ${url}`,
                    })),
                });
            }

            if (product) {
                await ApiGateway.updateData<Partial<Producto>>(`/api/productos/${product.id}`, {
                    name,
                    price: {
                        value: +precio,
                        currencyCode,
                    },
                    descriptionHtml,
                    images: [
                        ...product.images,
                        ...images.map((url) => ({
                            url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${url}`,
                            altText: `${productName} image - ${url}`,
                        })),
                    ],
                });
            }

            toast.success('Producto Guardado');
        } catch (error) {
            toast.error(ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGalleryOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.files?.length) {
            return;
        }
        for (let index = 0; index < e.target.files.length; index++) {
            const file = e.target.files.item(index);
            if (file) {
                setGallery([...gallery, file]);
                setImages([...images, URL.createObjectURL(file)]);
            }
        }
    };

    useEffect(() => {
        if (product) {
            const images = product.images as { url: string; altText: string }[];
            setValue('name', product.name);
            setValue('precio', (product.price as { value: string }).value);
            setValue('descriptionHtml', product.descriptionHtml);
            setImages(images.map(({ url }) => url));
        }
    }, [product, setValue]);

    return (
        <div className="w-full">
            <div className="flex gap-6 items-center mb-10 w-full">
                <div
                    className="cursor-pointer bg-zinc-900 text-white flex items-center justify-center rounded-full w-12 h-12 hover:bg-zinc-700"
                    onClick={() => router.back()}
                >
                    <IconArrowLeft size={20} />
                </div>
                <h2>Nuevo Producto</h2>
            </div>
            <div className="flex items-center justify-center mt-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full flex-1 items-center">
                    <div className="flex gap-8 w-full flex-1">
                        <Card className="py-4">
                            <Text h4 className="mb-4">
                                General
                            </Text>
                            <div className="flex flex-col gap-2 mb-4">
                                <Input
                                    {...register('name', { required: true })}
                                    clearable
                                    label="Nombre del Producto"
                                    placeholder="Piso Mosaico"
                                />
                                {errors.name && <RequiredTextError />}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Textarea
                                    {...register('descriptionHtml', { required: true })}
                                    label="Descripción del Producto"
                                    placeholder="Lozas de Mármol"
                                />
                                {errors.descriptionHtml && <RequiredTextError />}
                            </div>
                        </Card>

                        <Card className="py-4">
                            <Text h4 className="mb-4">
                                Precio
                            </Text>
                            <div className="flex flex-col mb-4">
                                <label
                                    htmlFor="currency"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                                >
                                    Moneda
                                </label>
                                <select
                                    {...register('currencyCode')}
                                    id="currency"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5"
                                >
                                    {['GTQ'].map((u) => (
                                        <option key={u} value={u}>
                                            {u}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Input
                                    {...register('precio', { required: true })}
                                    labelLeft="GTQ"
                                    label="Precio por unidad"
                                    placeholder="5000"
                                    type="number"
                                />
                                {errors.precio && <RequiredTextError />}
                            </div>
                        </Card>
                    </div>
                    <Card className="py-4">
                        <Text h4>Galería</Text>

                        <div className="w-full flex w-full h-44 mt-4">
                            <label htmlFor="single" className="w-full h-full">
                                <div className="pointer w-full h-full rounded-lg bg-zinc-50 border-dashed border-2 border-zinc-400 hover:bg-zinc-100 hover:border-solid hover:border-2 hover:border-blue-400 cursor-pointer flex items-center justify-center flex-col">
                                    <Text
                                        size={12}
                                        className="px-2 py-1 rounded-lg bg-blue-200 text-white font-bold text-blue-400"
                                    >
                                        Agregar Imagen
                                    </Text>
                                    <Text size={12} className="text-zinc-500 mt-6">
                                        Acepta .png, .jpg, .jpeg, .web
                                    </Text>
                                </div>
                            </label>
                            <input
                                style={{
                                    visibility: 'hidden',
                                    position: 'absolute',
                                }}
                                type="file"
                                id="single"
                                accept="image/*"
                                multiple={true}
                                onChange={handleGalleryOnChange}
                            />
                        </div>

                        <div className="flex mt-4 wrap gap-4">
                            {images.map((src) => (
                                <Image
                                    key={src}
                                    src={src}
                                    alt={`new-product-${src}`}
                                    width={100}
                                    height={100}
                                    className="rounded-lg"
                                    objectFit="cover"
                                />
                            ))}
                        </div>
                    </Card>

                    <Button
                        type="submit"
                        iconRight={isLoading && <Loading type="points-opacity" color="currentColor" size="lg" />}
                        disabled={isLoading}
                        rounded
                        className="w-64"
                    >
                        {product ? 'Actualizar Producto' : 'Crear Producto'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
