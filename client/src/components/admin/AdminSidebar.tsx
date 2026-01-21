import { Link, useLocation } from 'wouter';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Package,
  FolderTree,
  Zap,
  Gift,
  Truck,
  Percent,
  FileEdit,
  Code,
  Database,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: BarChart3, label: 'Análise', path: '/admin/analise' },
  { icon: ShoppingCart, label: 'Vendas', path: '/admin/vendas' },
  { icon: ShoppingBag, label: 'Carrinhos Abandonados', path: '/admin/carrinhos-abandonados' },
  { icon: CreditCard, label: 'Cartões', path: '/admin/cartoes' },
  { icon: Package, label: 'Produtos', path: '/admin/produtos' },
  { icon: FolderTree, label: 'Categorias', path: '/admin/categorias' },
  { icon: Zap, label: 'Order Bumps', path: '/admin/order-bumps' },
  { icon: Gift, label: 'Brinde', path: '/admin/brinde' },
  { icon: Truck, label: 'Frete', path: '/admin/frete' },
  { icon: Percent, label: 'Taxas', path: '/admin/taxas' },
  { icon: FileEdit, label: 'Edições em Massa', path: '/admin/edicoes-massa' },
  { icon: Code, label: 'Pixels & Scripts', path: '/admin/pixels-scripts' },
  { icon: Database, label: 'Banco de Dados', path: '/admin/banco-dados' },
  { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
];

export function AdminSidebar() {
  const [location, setLocation] = useLocation();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    setLocation('/admin');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TS</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">TikTok Shop</h1>
            <p className="text-gray-500 text-xs">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span className="text-lg">🔴</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
