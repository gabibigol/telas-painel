import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Plus, 
  Truck,
  Loader2,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function Frete() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'fixed' as 'fixed' | 'weight_based' | 'price_based' | 'free',
    price: '',
    minOrderValue: '',
    maxOrderValue: '',
    estimatedDays: 7,
    isActive: true,
  });

  const { data: rules, isLoading, refetch } = trpc.shippingRules.list.useQuery();
  
  const createMutation = trpc.shippingRules.create.useMutation({
    onSuccess: () => {
      toast.success('Regra de frete criada com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar regra');
    }
  });

  const updateMutation = trpc.shippingRules.update.useMutation({
    onSuccess: () => {
      toast.success('Regra de frete atualizada!');
      setIsModalOpen(false);
      setEditingRule(null);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar regra');
    }
  });

  const deleteMutation = trpc.shippingRules.delete.useMutation({
    onSuccess: () => {
      toast.success('Regra de frete excluída!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir regra');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'fixed',
      price: '',
      minOrderValue: '',
      maxOrderValue: '',
      estimatedDays: 7,
      isActive: true,
    });
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || '',
      type: rule.type || 'fixed',
      price: rule.price || '',
      minOrderValue: rule.minOrderValue || '',
      maxOrderValue: rule.maxOrderValue || '',
      estimatedDays: rule.estimatedDays || 7,
      isActive: rule.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRule) {
      updateMutation.mutate({ id: editingRule.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatPrice = (price: string | number | null) => {
    if (!price) return 'R$ 0,00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fixed: 'Fixo',
      weight_based: 'Por Peso',
      price_based: 'Por Valor',
      free: 'Grátis',
    };
    return labels[type] || type;
  };

  return (
    <AdminLayout title="Frete" subtitle="Configure as regras de frete">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button 
          onClick={() => { resetForm(); setEditingRule(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Regra
        </Button>
      </div>

      {/* Rules Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !rules || rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Truck className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhuma regra de frete cadastrada</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline" 
              className="mt-4"
            >
              Criar primeira regra
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Nome</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Tipo</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Valor</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Prazo</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium">{rule.name}</p>
                    </td>
                    <td className="p-4 text-gray-300">
                      {getTypeLabel(rule.type)}
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">
                        {rule.type === 'free' ? 'Grátis' : formatPrice(rule.price)}
                      </p>
                    </td>
                    <td className="p-4 text-gray-300">
                      {rule.estimatedDays} dias
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {rule.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(rule)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate({ id: rule.id })}
                          disabled={deleteMutation.isPending}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingRule ? 'Editar Regra' : 'Nova Regra de Frete'}
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
                  placeholder="Ex: Frete Padrão"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="fixed">Valor Fixo</option>
                  <option value="weight_based">Por Peso</option>
                  <option value="price_based">Por Valor do Pedido</option>
                  <option value="free">Frete Grátis</option>
                </select>
              </div>

              {formData.type !== 'free' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Valor (R$)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
              )}

              {formData.type === 'price_based' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Valor Mínimo</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      placeholder="0.00"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Valor Máximo</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.maxOrderValue}
                      onChange={(e) => setFormData({ ...formData, maxOrderValue: e.target.value })}
                      placeholder="0.00"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Prazo de Entrega (dias)</label>
                <Input
                  type="number"
                  value={formData.estimatedDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDays: parseInt(e.target.value) })}
                  placeholder="7"
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
                <label htmlFor="isActive" className="text-gray-300">Regra ativa</label>
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
                  {editingRule ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
