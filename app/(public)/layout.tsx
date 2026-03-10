// Public layout
import { Toaster } from 'react-hot-toast';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0a0f0a]">
            {children}
        </div>
    );
}
