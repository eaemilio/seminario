import { Button, Collapse, Text } from '@nextui-org/react';
import Link from 'next/link';
import styles from '../../../styles/admin/layout/Sidebar.module.scss';
import {
    IconHome,
    IconDatabase,
    IconPackage,
    IconList,
    IconHexagon,
    IconLayers,
    IconCodesandbox,
    IconTruck,
    IconShoppingBag,
    IconMapPin,
} from '@supabase/ui';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { GiroNegocio } from '../../../constants';
import usePermissions from '../../../hooks/usePermissions';
import Image from 'next/image';

export default function Sidebar() {
    const { hasAccess } = usePermissions();

    return (
        <div
            className="w-64 h-screen bg-zinc-50 sidebar py-20 px-2 relative"
            style={{ borderRight: 'solid 1px rgb(228 228 231)', overflowY: 'auto' }}
        >
            <Link href={process.env.COMMERCE_URL ?? '#'}>
                <Image src="/logo.svg" height={50} alt="logo" width={295} />
            </Link>
            <div className="px-4 pb-6 pt-10 flex flex-col">
                <Link href="/admin">
                    <div className="flex gap-4 cursor-pointer items-center">
                        <IconHome size={16} />
                        <Text className={styles.menuItem} size={14}>
                            Dashboard
                        </Text>
                    </div>
                </Link>
            </div>

            {/* Plantas de extracción Minera */}

            {hasAccess(GiroNegocio.EXTRACCION_MINERA) && (
                <div className="px-4 flex flex-col mb-10">
                    <Text size={12} className="text-zinc-400 font-bold mb-2">
                        Extracción Minera
                    </Text>
                    <Link href="/admin/minerales/plantas">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconDatabase size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Plantas de Extracción
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin/minerales/inventario">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconList size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Inventario de Materia Prima
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin/minerales/tipos">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconHexagon size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Tipos de Minerales
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin/minerales/pedidos">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconPackage size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Pedidos de Materia Prima
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconTruck size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Envíos de Materia Prima
                            </Text>
                        </div>
                    </Link>
                </div>
            )}

            {/* Plantas de Procesado - Producto */}

            {hasAccess(GiroNegocio.MATERIA_PRIMA) && (
                <div className="px-4 flex flex-col mb-10">
                    <Text size={12} className="text-zinc-400 font-bold mb-2">
                        Productos
                    </Text>
                    <Link href="/admin/productos/plantas">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconCodesandbox size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Plantas de Proceso
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin/productos">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconCodesandbox size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Productos
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin/productos/inventario">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconLayers size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Inventario de Productos
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconPackage size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Pedidos de Productos
                            </Text>
                        </div>
                    </Link>
                </div>
            )}

            {/* Maquinaria */}

            {hasAccess(GiroNegocio.MAQUINARIA) && (
                <div className="px-4 flex flex-col mb-10">
                    <Text size={12} className="text-zinc-400 font-bold mb-2">
                        Maquinaria
                    </Text>
                    <Link href="/admin/maquinaria/sucursales">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconMapPin size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Sucursales
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconShoppingBag size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Ventas
                            </Text>
                        </div>
                    </Link>
                    <Link href="/admin">
                        <div className="flex gap-4 cursor-pointer items-center">
                            <IconTruck size={16} />
                            <Text className={styles.menuItem} size={14}>
                                Inventario de Maquinaria
                            </Text>
                        </div>
                    </Link>
                </div>
            )}
            {/* <Button color="error" rounded flat className="w-full" onClick={() => supabaseClient.auth.signOut()}>
                Cerrar Sesión
            </Button> */}
        </div>
    );
}
