import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Plus, 
  Gift,
  Loader2,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function Brinde() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minOrderValue: '',
    maxQuantityPerOrder: 1,
    totalStock: '',
    imageUrl: '',
    isActive: true,
  });

  const { data: gifts, isLoading, refetch } = trpc.gifts.list.useQuery();
  
  const createMutation = trpc.gifts.create.useMutation({
    onSuccess: () => {
      toast.success('Brinde criado com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar brinde');
    }
  });

  const updateMutation = trpc.gifts.update.useMutation({
    onSuccess: () => {
      toast.success('Brinde atualizado!');
      setIsModalOpen(false);
      setEditingGift(null);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar brinde');
    }
  });

  const deleteMutation = trpc.gifts.delete.useMutation({
    onSuccess: () => {
      toast.success('Brinde excluído!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir brinde');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      minOrderValue: '',
      maxQuantityPerOrder: 1,
      totalStock: '',
      imageUrl: '',
      isActive: true,
    });
  };

  const handleEdit = (gift: any) => {
    setEditingGift(gift);
    setFormData({
      name: gift.name || '',
      description: gift.description || '',
      minOrderValue: gift.minOrderValue || '',
      maxQuantityPerOrder: gift.maxQuantityPerOrder || 1,
      totalStock: gift.stock?.toString() || '',
      imageUrl: gift.imageUrl || '',
      isActive: gift.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      totalStock: formData.totalStock ? parseInt(formData.totalStock) : undefined,
    };
    if (editingGift) {
      updateMutation.mutate({ id: editingGift.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const formatPrice = (price: string | number | null) => {
    if (!price) return 'R$ 0,00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  return (
    <AdminLayout title="Brinde" subtitle="Configure brindes para incentivar compras">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">Brindes são oferecidos para compras acima de determinado valor.</p>
        <Button 
          onClick={() => { resetForm(); setEditingGift(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Brinde
        </Button>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !gifts || gifts.length === 0 ? (
          <div className="col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col items-center justify-center py-12 text-gray-400">
            <Gift className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum brinde cadastrado</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline" 
              className="mt-4"
            >
              Criar primeiro brinde
            </Button>
          </div>
        ) : (
          gifts.map((gift) => (
            <div 
              key={gift.id} 
              className={`p-4 rounded-xl border ${
                gift.isActive 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-gray-900/30 border-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    gift.isActive ? 'bg-pink-500/20' : 'bg-gray-700'
                  }`}>
                    <Gift className={`w-6 h-6 ${gift.isActive ? 'text-pink-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{gift.name}</p>
                    <p className="text-gray-500 text-sm">Compras acima de {formatPrice(gift.minOrderValue)}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  gift.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {gift.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              {gift.description && (
                <p className="text-gray-400 text-sm mt-2">{gift.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  {gift.stock !== null ? `${gift.stock} unidades em estoque` : 'Estoque ilimitado'}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(gift)}
                    className="text-gray-400 hover:text-blue-400"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteMutation.mutate({ id: gift.id })}
                    disabled={deleteMutation.isPending}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingGift ? 'Editar Brinde' : 'Novo Brinde'}
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
                  placeholder="Ex: Chaveiro Exclusivo"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Chaveiro de metal com logo da marca"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Valor Mínimo (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    placeholder="100.00"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Estoque</label>
                  <Input
                    type="number"
                    value={formData.totalStock}
                    onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
                    placeholder="Deixe vazio para ilimitado"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Máx. por Pedido</label>
                <Input
                  type="number"
                  value={formData.maxQuantityPerOrder}
                  onChange={(e) => setFormData({ ...formData, maxQuantityPerOrder: parseInt(e.target.value) })}
                  placeholder="1"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL da Imagem</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-800"
                />
                <label htmlFor="isActive" className="text-gray-300">Brinde ativo</label>
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
                  {editingGift ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
