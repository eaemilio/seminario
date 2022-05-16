import { Ring } from '@uiball/loaders';

export default function Loading() {
    return (
        <div
            className="absolute w-full h-full flex justify-center items-center"
            style={{ zIndex: 1000, backgroundColor: 'rgba(255,255,255,0.4)' }}
        >
            <Ring size={40} lineWeight={5} speed={2} color="black" />
        </div>
    );
}
