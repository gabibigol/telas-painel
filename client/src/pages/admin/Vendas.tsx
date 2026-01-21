import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Search, 
  Eye,
  ShoppingBag,
  Loader2,
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function Vendas() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading, refetch } = trpc.orders.list.useQuery({ 
    search: search || undefined,
    status: statusFilter || undefined
  });
  
  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar status');
    }
  });

  const formatPrice = (price: string | number | null) => {
    if (!price) return 'R$ 0,00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      shipped: 'bg-purple-500/20 text-purple-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${styles[status] || styles.pending}`}>
        {getStatusIcon(status)}
        {labels[status] || status}
      </span>
    );
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, orderStatus: newStatus as any });
  };

  // Stats
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.orderStatus === 'pending').length || 0,
    processing: orders?.filter(o => o.orderStatus === 'processing').length || 0,
    delivered: orders?.filter(o => o.orderStatus === 'delivered').length || 0,
  };

  return (
    <AdminLayout title="Vendas" subtitle="Gerencie os pedidos da sua loja">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Total de Pedidos</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Processando</p>
          <p className="text-2xl font-bold text-blue-400">{stats.processing}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Entregues</p>
          <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por número do pedido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Processando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Pedido</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Cliente</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Total</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Data</th>
                  <th className="text-right p-4 text-gray-400 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium">#{order.orderNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">{order.customerName || '-'}</p>
                      <p className="text-gray-500 text-sm">{order.customerEmail || '-'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{formatPrice(order.total)}</p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="p-4 text-gray-300 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none"
                        >
                          <option value="pending">Pendente</option>
                          <option value="processing">Processando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregue</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                Pedido #{selectedOrder.orderNumber}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status:</span>
                {getStatusBadge(selectedOrder.orderStatus)}
              </div>

              {/* Customer Info */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Informações do Cliente</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Nome:</span> <span className="text-white">{selectedOrder.customerName || '-'}</span></p>
                  <p><span className="text-gray-400">Email:</span> <span className="text-white">{selectedOrder.customerEmail || '-'}</span></p>
                  <p><span className="text-gray-400">Telefone:</span> <span className="text-white">{selectedOrder.customerPhone || '-'}</span></p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Endereço de Entrega</h3>
                <p className="text-gray-300 text-sm">{selectedOrder.shippingAddress || 'Não informado'}</p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Resumo do Pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Frete:</span>
                    <span className="text-white">{formatPrice(selectedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Desconto:</span>
                    <span className="text-green-400">-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-white font-bold">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Pagamento</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Método:</span> <span className="text-white">{selectedOrder.paymentMethod || '-'}</span></p>
                  <p><span className="text-gray-400">Status:</span> <span className="text-white">{selectedOrder.paymentStatus || '-'}</span></p>
                </div>
              </div>

              {/* Dates */}
              <div className="text-sm text-gray-400">
                <p>Criado em: {formatDate(selectedOrder.createdAt)}</p>
                <p>Atualizado em: {formatDate(selectedOrder.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
