import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderTree,
  Loader2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function Categorias() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
    sortOrder: 0,
  });

  const { data: categories, isLoading, refetch } = trpc.categories.list.useQuery({ search: search || undefined });
  
  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success('Categoria criada com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar categoria');
    }
  });

  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success('Categoria atualizada com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar categoria');
    }
  });

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success('Categoria excluída com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao excluir categoria');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
      sortOrder: 0,
    });
    setEditingCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        ...formData,
        slug,
      });
    } else {
      createMutation.mutate({
        ...formData,
        slug,
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <AdminLayout title="Categorias" subtitle="Organize seus produtos em categorias">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar categorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Button onClick={openCreateModal} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FolderTree className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhuma categoria encontrada</p>
            <Button onClick={openCreateModal} variant="link" className="mt-2 text-primary">
              Criar primeira categoria
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Categoria</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Slug</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Ordem</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
                            <FolderTree className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{category.name}</p>
                          {category.description && (
                            <p className="text-gray-500 text-sm truncate max-w-xs">{category.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{category.slug}</td>
                    <td className="p-4 text-gray-300">{category.sortOrder}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {category.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(category)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
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
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome da categoria"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="nome-da-categoria"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Deixe em branco para gerar automaticamente</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da categoria..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">URL da Imagem</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ordem</label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-300">Categoria Ativa</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
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
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
