import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

type MyComponentProps = React.PropsWithChildren<{}>;

export default function AdminLayout({ children }: MyComponentProps) {
    return (
        <>
            <Toaster />
            <div className="flex h-screen w-screen">
                <Sidebar></Sidebar>
                <div className="flex flex-col flex-1">
                    <Navbar></Navbar>
                    <main className="flex-1 py-10 px-6">{children}</main>
                </div>
            </div>
        </>
    );
}
