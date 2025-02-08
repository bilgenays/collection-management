'use client';

import { useAuth } from '@/lib/hooks/useSession';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LightModeIcon from '@mui/icons-material/LightMode';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import MenuIcon from '@mui/icons-material/Menu';
import { Badge } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './globals.css';
import { useCollectionStore } from '@/lib/store/useCollectionStore';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { products } = useCollectionStore();

  useEffect(() => {
    if (session && pathname === '/login') {
      router.replace('/collections');
      return;
    }
    
    if (!session && pathname !== '/login') {
      router.replace('/login');
      return;
    }
  }, [session, router, pathname]);

  if (pathname === '/login') {
    return children;
  }

  if (!session) {
    return null;
  }

  const getHeaderInfo = () => {
    if (pathname === '/collections') {
      return {
        title: 'Koleksiyon',
        subtitle: 'Koleksiyon Listesi'
      };
    }
    
    if (pathname.includes('/collections/') && pathname.includes('/edit')) {
      const collectionId = pathname.split('/')[2];
      return {
        title: 'Koleksiyon',
        subtitle: `Sabitleri Düzenle - Koleksiyon ${collectionId} ${products.length > 0 ? `- ${products.length} Ürün` : ''}`
      };
    }

    return {
      title: 'Koleksiyon',
      subtitle: ''
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white border-r border-gray-200">
    <div className="p-6">
      <h1 className="text-2xl font-bold">LOGO</h1>
    </div>
    <nav className="mt-6">
      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
        MENÜ
      </div>
      <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
        <DashboardIcon className="w-5 h-5 mr-3" />
        Dashboard
      </a>
      <div className="mt-4 flex items-center">
        <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
          <ShoppingBasketIcon className="w-5 h-5 mr-3" />
          Ürünler
        </a>
        <div className="relative flex items-center">
          <ExpandMoreIcon className="cursor-default" />
        </div>
      </div>
      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
        Satış
      </div>
      <a href="/collections" className="flex items-center px-6 py-3 text-blue-600 bg-blue-50">
        <ListAltIcon className="w-5 h-5 mr-3" />
        Koleksiyon
      </a>
    </nav>
  </aside>

    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-col items-start space-x-0">
            <h1 className="text-lg font-medium">{headerInfo.title}</h1>
            <span className="text-gray-500">{headerInfo.subtitle}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <LightModeIcon />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <LanguageIcon />
            </button>
            <Badge badgeContent={2} color="primary">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <NotificationsIcon />
              </button>
            </Badge>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <EmailIcon />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MenuIcon />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
    </div>
  )
}