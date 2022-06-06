import { Usuario } from '@prisma/client';
import { Metronome } from '@uiball/loaders';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useSWRConfig } from 'swr';
import ApiGateway from '../../services/api-gateway';
import { supabase } from '../../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

export default function ProfilePicture({ profile }: { profile: Usuario }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { mutate } = useSWRConfig();
    const onPictureChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        try {
            setIsLoading(true);
            if (!e.target.files) {
                return;
            }
            const file = e.target.files.item(0);
            if (!file) {
                return;
            }

            const ext = file?.name.split('.').pop();
            const { error, data } = await supabase.storage.from('avatar').upload(`${uuidv4()}.${ext}`, file);
            if (error) throw error;
            await ApiGateway.updateData<Usuario>(`/api/users/${profile.id}`, {
                avatarUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.Key}`,
            });
            mutate(['/api/users', profile.id]);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex">
            <div className="w-48 h-48 relative overflow-hidden rounded-full shadow-xl flex justify-center items-center">
                {profile.avatarUrl && (
                    <Image src={profile.avatarUrl} alt="Profile picture" layout="fill" objectFit="cover" />
                )}
                <label
                    htmlFor="profile-pic"
                    className="w-full h-full absolute hover:bg-zinc-800 opacity-80 cursor-pointer ease-in-out duration-200"
                ></label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="profile-pic"
                    accept="image/*"
                    multiple={false}
                    onChange={onPictureChange}
                />
                {isLoading && (
                    <div className="flex items-center justify-center h-full w-full absolute bg-zinc-800 opacity-70"></div>
                )}
                {isLoading && <Metronome size={40} speed={1.6} color="white" />}
            </div>
        </div>
    );
}
