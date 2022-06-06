import { Avatar } from '@nextui-org/react';
import { IconBell } from '@supabase/ui';
import Link from 'next/link';
import useProfile from '../../../hooks/useProfile';
import { getInitals } from '../../../utils/helper';

export default function Navbar() {
    const { profile } = useProfile();

    return (
        <div className="p-6 justify-between items-center flex">
            <div></div>
            <div className="flex items-center gap-8">
                <IconBell size={22} className="cursor-pointer" />
                <Link href="/admin/profile">
                    <Avatar
                        text={getInitals(profile?.nombre ?? '')}
                        src={profile?.avatarUrl ?? ''}
                        zoomed
                        size="md"
                        className="cursor-pointer"
                    ></Avatar>
                </Link>
            </div>
        </div>
    );
}
