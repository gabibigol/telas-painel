import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: recentOrders, isLoading: ordersLoading } = trpc.dashboard.recentOrders.useQuery({ limit: 5 });
  const { data: topProducts, isLoading: productsLoading } = trpc.dashboard.topProducts.useQuery({ limit: 5 });

  const formatPrice = (price: string | number | null | undefined) => {
    if (!price) return 'R$ 0,00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      paid: 'bg-green-500/20 text-green-400',
      shipped: 'bg-blue-500/20 text-blue-400',
      delivered: 'bg-purple-500/20 text-purple-400',
      cancelled: 'bg-red-500/20 text-red-400',
      refunded: 'bg-gray-500/20 text-gray-400',
    };
    const labels: Record<string, string> = {
      pending: 'Pendente',
      paid: 'Pago',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const statsConfig = [
    {
      title: 'Receita Total',
      value: stats?.totalRevenue ? formatPrice(stats.totalRevenue) : 'R$ 0,00',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total de Vendas',
      value: stats?.totalOrders?.toString() || '0',
      change: '+15.3%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Produtos Cadastrados',
      value: stats?.totalProducts?.toString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Carrinhos Abandonados',
      value: stats?.abandonedCarts?.toString() || '0',
      change: '-5.2%',
      trend: 'down',
      icon: ShoppingBag,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Visão geral da sua loja">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsConfig.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={stat.trend === 'up' ? 'text-green-500 text-sm' : 'text-red-500 text-sm'}>
                          {stat.change}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">vs mês anterior</span>
                      </div>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Pedidos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !recentOrders || recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">Nenhum pedido encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">#{order.id}</p>
                      <p className="text-gray-400 text-sm">{order.customerName || order.customerEmail || 'Cliente'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{formatPrice(order.total)}</p>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5" />
              Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : !topProducts || topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">Nenhum produto vendido ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium text-sm">{product.name}</p>
                          <p className="text-gray-400 text-xs">{product.stock} em estoque</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-green-400 font-medium">{formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Categorias Ativas</p>
                <p className="text-2xl font-bold text-white">{stats?.totalCategories || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Usuários Cadastrados</p>
                <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ticket Médio</p>
                <p className="text-2xl font-bold text-white">
                  {stats?.totalOrders && stats?.totalRevenue 
                    ? formatPrice(Number(stats.totalRevenue) / stats.totalOrders)
                    : 'R$ 0,00'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
