import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Search, 
  ShoppingCart,
  Loader2,
  Mail,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

export default function CarrinhosAbandonados() {
  const [search, setSearch] = useState('');
  const [filterRecovered, setFilterRecovered] = useState<string>('');

  const { data: carts, isLoading, refetch } = trpc.abandonedCarts.list.useQuery({ 
    search: search || undefined,
    isRecovered: filterRecovered === 'recovered' ? true : filterRecovered === 'pending' ? false : undefined
  });
  
  const markRecoveredMutation = trpc.abandonedCarts.markRecovered.useMutation({
    onSuccess: () => {
      toast.success('Carrinho marcado como recuperado!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar carrinho');
    }
  });

  const sendEmailMutation = trpc.abandonedCarts.sendRecoveryEmail.useMutation({
    onSuccess: () => {
      toast.success('Email de recuperação enviado!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar email');
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

  // Stats
  const stats = {
    total: carts?.length || 0,
    pending: carts?.filter(c => !c.isRecovered).length || 0,
    recovered: carts?.filter(c => c.isRecovered).length || 0,
    totalValue: carts?.reduce((acc, c) => acc + parseFloat(c.totalValue || '0'), 0) || 0,
  };

  return (
    <AdminLayout title="Carrinhos Abandonados" subtitle="Recupere vendas perdidas">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Recuperados</p>
          <p className="text-2xl font-bold text-green-400">{stats.recovered}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <p className="text-gray-400 text-sm">Valor Total</p>
          <p className="text-2xl font-bold text-primary">{formatPrice(stats.totalValue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <select
          value={filterRecovered}
          onChange={(e) => setFilterRecovered(e.target.value)}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos</option>
          <option value="pending">Pendentes</option>
          <option value="recovered">Recuperados</option>
        </select>
      </div>

      {/* Carts Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !carts || carts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ShoppingCart className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum carrinho abandonado encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Cliente</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Itens</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Valor</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Data</th>
                  <th className="text-right p-4 text-gray-400 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-white">{cart.customerEmail || '-'}</p>
                      <p className="text-gray-500 text-sm">{cart.customerPhone || '-'}</p>
                    </td>
                    <td className="p-4 text-gray-300">
                      {(cart.items as any[])?.length || 0} itens
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{formatPrice(cart.totalValue)}</p>
                    </td>
                    <td className="p-4">
                      {cart.isRecovered ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Recuperado
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-300 text-sm">
                      {formatDate(cart.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {!cart.isRecovered && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => sendEmailMutation.mutate({ id: cart.id })}
                              disabled={sendEmailMutation.isPending || cart.recoveryEmailSent}
                              className="text-gray-400 hover:text-white"
                              title={cart.recoveryEmailSent ? 'Email já enviado' : 'Enviar email de recuperação'}
                            >
                              <Mail className={`w-4 h-4 ${cart.recoveryEmailSent ? 'text-green-400' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markRecoveredMutation.mutate({ id: cart.id })}
                              disabled={markRecoveredMutation.isPending}
                              className="text-gray-400 hover:text-green-400"
                              title="Marcar como recuperado"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
