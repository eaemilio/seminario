import { Text } from '@nextui-org/react';
import Link from 'next/link';
import styles from '../../../styles/admin/layout/Sidebar.module.scss';
import {
    IconHome,
    IconDatabase,
    IconShoppingBag,
    IconPackage,
    IconList,
    IconHexagon,
    IconLayers,
    IconCodesandbox,
    IconTruck,
} from '@supabase/ui';
import { BsBag, BsShopWindow, BsTruckFlatbed } from 'react-icons/bs';

export default function Sidebar() {
    return (
        <div
            className="md:w-64 w-32 h-screen bg-zinc-50 sidebar py-20 px-2"
            style={{ borderRight: 'solid 1px rgb(228 228 231)', overflowY: 'auto' }}
        >
            <div className="px-4 py-6 flex flex-col">
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
                <Link href="/admin">
                    <div className="flex gap-4 cursor-pointer items-center">
                        <IconList size={16} />
                        <Text className={styles.menuItem} size={14}>
                            Inventario de Materia Prima
                        </Text>
                    </div>
                </Link>
                <Link href="/admin">
                    <div className="flex gap-4 cursor-pointer items-center">
                        <IconHexagon size={16} />
                        <Text className={styles.menuItem} size={14}>
                            Tipos de Minerales
                        </Text>
                    </div>
                </Link>
                <Link href="/admin">
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

            {/* Plantas de Procesado - Producto */}

            <div className="px-4 flex flex-col mb-10">
                <Text size={12} className="text-zinc-400 font-bold mb-2">
                    Materia Prima
                </Text>
                <Link href="/admin">
                    <div className="flex gap-4 cursor-pointer items-center">
                        <IconCodesandbox size={16} />
                        <Text className={styles.menuItem} size={14}>
                            Plantas de Proceso
                        </Text>
                    </div>
                </Link>
                <Link href="/admin">
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

            {/* Maquinaria */}

            <div className="px-4 flex flex-col mb-10">
                <Text size={12} className="text-zinc-400 font-bold mb-2">
                    Maquinaria
                </Text>
                <Link href="/admin">
                    <div className="flex gap-4 cursor-pointer items-center">
                        <BsShopWindow size={16} color="#636363" />
                        <Text className={styles.menuItem} size={14}>
                            Sucursales
                        </Text>
                    </div>
                </Link>
                <Link href="/admin">
                    <div className="flex gap-4 cursor-pointer items-center">
                        <BsBag size={16} color="#636363" />
                        <Text className={styles.menuItem} size={14}>
                            Ventas
                        </Text>
                    </div>
                </Link>
                <Link href="/admin">
                    <div className="flex gap-4 cursor-pointer items-center">
                        <BsTruckFlatbed size={16} color="#636363" />
                        <Text className={styles.menuItem} size={14}>
                            Inventario de Maquinaria
                        </Text>
                    </div>
                </Link>
            </div>
        </div>
    );
}
