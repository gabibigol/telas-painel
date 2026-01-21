import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Plus, 
  Percent,
  Loader2,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function Taxas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    appliesTo: 'all' as 'all' | 'credit_card' | 'debit_card' | 'pix' | 'boleto',
    isActive: true,
  });

  const { data: fees, isLoading, refetch } = trpc.fees.list.useQuery();
  
  const createMutation = trpc.fees.create.useMutation({
    onSuccess: () => {
      toast.success('Taxa criada com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar taxa');
    }
  });

  const updateMutation = trpc.fees.update.useMutation({
    onSuccess: () => {
      toast.success('Taxa atualizada!');
      setIsModalOpen(false);
      setEditingFee(null);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar taxa');
    }
  });

  const deleteMutation = trpc.fees.delete.useMutation({
    onSuccess: () => {
      toast.success('Taxa excluída!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir taxa');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'percentage',
      value: '',
      appliesTo: 'all',
      isActive: true,
    });
  };

  const handleEdit = (fee: any) => {
    setEditingFee(fee);
    setFormData({
      name: fee.name || '',
      type: fee.type || 'percentage',
      value: fee.value || '',
      appliesTo: fee.appliesTo || 'all',
      isActive: fee.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFee) {
      updateMutation.mutate({ id: editingFee.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatValue = (fee: any) => {
    if (fee.type === 'percentage') {
      return `${fee.value}%`;
    }
    const num = parseFloat(fee.value || '0');
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  const getAppliesToLabel = (appliesTo: string) => {
    const labels: Record<string, string> = {
      all: 'Todos',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'PIX',
      boleto: 'Boleto',
    };
    return labels[appliesTo] || appliesTo;
  };

  return (
    <AdminLayout title="Taxas" subtitle="Configure as taxas de pagamento">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button 
          onClick={() => { resetForm(); setEditingFee(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Taxa
        </Button>
      </div>

      {/* Fees Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !fees || fees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Percent className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhuma taxa cadastrada</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline" 
              className="mt-4"
            >
              Criar primeira taxa
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
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Aplica-se a</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium">{fee.name}</p>
                    </td>
                    <td className="p-4 text-gray-300">
                      {fee.type === 'percentage' ? 'Percentual' : 'Fixo'}
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">{formatValue(fee)}</p>
                    </td>
                    <td className="p-4 text-gray-300">
                      {getAppliesToLabel(fee.appliesTo)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fee.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {fee.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(fee)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate({ id: fee.id })}
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
                {editingFee ? 'Editar Taxa' : 'Nova Taxa'}
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
                  placeholder="Ex: Taxa de Cartão"
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
                  <option value="percentage">Percentual (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Valor {formData.type === 'percentage' ? '(%)' : '(R$)'}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Aplica-se a</label>
                <select
                  value={formData.appliesTo}
                  onChange={(e) => setFormData({ ...formData, appliesTo: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos os métodos</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit_card">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                  <option value="boleto">Boleto</option>
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
                <label htmlFor="isActive" className="text-gray-300">Taxa ativa</label>
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
                  {editingFee ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
