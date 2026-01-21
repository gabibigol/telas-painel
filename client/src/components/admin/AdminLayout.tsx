import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdminSidebar } from './AdminSidebar';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { isAuthenticated } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/admin');
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <AdminSidebar />
      <main className="ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
