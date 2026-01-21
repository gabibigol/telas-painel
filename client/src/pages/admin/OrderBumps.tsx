import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Plus, 
  Zap,
  Loader2,
  Pencil,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function OrderBumps() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBump, setEditingBump] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productId: undefined as number | undefined,
    triggerProductIds: [] as number[],
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    displayPosition: 'before_checkout' as 'before_checkout' | 'after_checkout' | 'cart_page',
    isActive: true,
  });

  const { data: bumps, isLoading, refetch } = trpc.orderBumps.list.useQuery();
  const { data: products } = trpc.products.list.useQuery({});
  
  const createMutation = trpc.orderBumps.create.useMutation({
    onSuccess: () => {
      toast.success('Order Bump criado com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar order bump');
    }
  });

  const updateMutation = trpc.orderBumps.update.useMutation({
    onSuccess: () => {
      toast.success('Order Bump atualizado!');
      setIsModalOpen(false);
      setEditingBump(null);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar order bump');
    }
  });

  const deleteMutation = trpc.orderBumps.delete.useMutation({
    onSuccess: () => {
      toast.success('Order Bump excluído!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir order bump');
    }
  });

  const toggleMutation = trpc.orderBumps.update.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      productId: undefined,
      triggerProductIds: [],
      discountType: 'percentage',
      discountValue: '',
      displayPosition: 'before_checkout',
      isActive: true,
    });
  };

  const handleEdit = (bump: any) => {
    setEditingBump(bump);
    setFormData({
      name: bump.name || '',
      description: bump.description || '',
      productId: bump.productId,
      triggerProductIds: bump.triggerProductIds || [],
      discountType: bump.discountType || 'percentage',
      discountValue: bump.discountValue || '',
      displayPosition: bump.displayPosition || 'before_checkout',
      isActive: bump.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error('Selecione um produto');
      return;
    }
    if (editingBump) {
      updateMutation.mutate({ id: editingBump.id, ...formData, productId: formData.productId });
    } else {
      createMutation.mutate({ ...formData, productId: formData.productId });
    }
  };

  const handleToggle = (bump: any) => {
    toggleMutation.mutate({ id: bump.id, isActive: !bump.isActive });
  };

  const formatDiscount = (bump: any) => {
    if (bump.discountType === 'percentage') {
      return `${bump.discountValue}% OFF`;
    }
    const num = parseFloat(bump.discountValue || '0');
    return `R$ ${num.toFixed(2).replace('.', ',')} OFF`;
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      before_checkout: 'Antes do Checkout',
      after_checkout: 'Após o Checkout',
      cart_page: 'Página do Carrinho',
    };
    return labels[position] || position;
  };

  return (
    <AdminLayout title="Order Bumps" subtitle="Ofertas adicionais para aumentar o ticket médio">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">Order Bumps são ofertas exibidas no checkout para aumentar o ticket médio.</p>
        <Button 
          onClick={() => { resetForm(); setEditingBump(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Order Bump
        </Button>
      </div>

      {/* Bumps List */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !bumps || bumps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Zap className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum order bump cadastrado</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline" 
              className="mt-4"
            >
              Criar primeiro order bump
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {bumps.map((bump) => (
              <div key={bump.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    bump.isActive ? 'bg-yellow-500/20' : 'bg-gray-700'
                  }`}>
                    <Zap className={`w-6 h-6 ${bump.isActive ? 'text-yellow-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{bump.name}</p>
                    <p className="text-gray-500 text-sm">{bump.description || 'Sem descrição'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-green-400 font-medium">{formatDiscount(bump)}</p>
                    <p className="text-gray-500 text-xs">Desconto</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 font-medium">{getPositionLabel(bump.displayPosition)}</p>
                    <p className="text-gray-500 text-xs">Posição</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggle(bump)}
                    className={bump.isActive ? 'text-green-400' : 'text-gray-500'}
                  >
                    {bump.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(bump)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: bump.id })}
                      disabled={deleteMutation.isPending}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
              <h2 className="text-xl font-bold text-white">
                {editingBump ? 'Editar Order Bump' : 'Novo Order Bump'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Garantia Estendida"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Proteja seu produto por mais 1 ano"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Produto Oferecido</label>
                <select
                  value={formData.productId || ''}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione um produto</option>
                  {products?.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Desconto</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="percentage">Percentual (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Valor do Desconto</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="0"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Posição de Exibição</label>
                <select
                  value={formData.displayPosition}
                  onChange={(e) => setFormData({ ...formData, displayPosition: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="before_checkout">Antes do Checkout</option>
                  <option value="after_checkout">Após o Checkout</option>
                  <option value="cart_page">Página do Carrinho</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-800"
                />
                <label htmlFor="isActive" className="text-gray-300">Order Bump ativo</label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingBump ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
