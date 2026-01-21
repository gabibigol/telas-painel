import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Plus, 
  Code,
  Loader2,
  Pencil,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function PixelsScripts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPixel, setEditingPixel] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'facebook' as 'facebook' | 'google_analytics' | 'google_tag_manager' | 'tiktok' | 'custom',
    pixelId: '',
    isActive: true,
  });

  const { data: pixels, isLoading, refetch } = trpc.trackingPixels.list.useQuery();
  
  const createMutation = trpc.trackingPixels.create.useMutation({
    onSuccess: () => {
      toast.success('Pixel criado com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar pixel');
    }
  });

  const updateMutation = trpc.trackingPixels.update.useMutation({
    onSuccess: () => {
      toast.success('Pixel atualizado!');
      setIsModalOpen(false);
      setEditingPixel(null);
      resetForm();
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar pixel');
    }
  });

  const deleteMutation = trpc.trackingPixels.delete.useMutation({
    onSuccess: () => {
      toast.success('Pixel excluído!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir pixel');
    }
  });

  const toggleMutation = trpc.trackingPixels.update.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      platform: 'facebook',
      pixelId: '',
      isActive: true,
    });
  };

  const handleEdit = (pixel: any) => {
    setEditingPixel(pixel);
    setFormData({
      name: pixel.name || '',
      platform: pixel.platform || 'facebook',
      pixelId: pixel.pixelId || '',
      isActive: pixel.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPixel) {
      updateMutation.mutate({ id: editingPixel.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleToggle = (pixel: any) => {
    toggleMutation.mutate({ id: pixel.id, isActive: !pixel.isActive });
  };

  const getPlatformLabel = (platform: string) => {
    const labels: Record<string, string> = {
      facebook: 'Facebook Pixel',
      google_analytics: 'Google Analytics',
      google_tag_manager: 'Google Tag Manager',
      tiktok: 'TikTok Pixel',
      custom: 'Script Personalizado',
    };
    return labels[platform] || platform;
  };

  return (
    <AdminLayout title="Pixels & Scripts" subtitle="Gerencie integrações de rastreamento">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-400">Configure pixels de rastreamento e scripts personalizados.</p>
        <Button 
          onClick={() => { resetForm(); setEditingPixel(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pixel
        </Button>
      </div>

      {/* Pixels List */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !pixels || pixels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Code className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum pixel cadastrado</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              variant="outline" 
              className="mt-4"
            >
              Adicionar primeiro pixel
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {pixels.map((pixel) => (
              <div key={pixel.id} className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    pixel.isActive ? 'bg-green-500/20' : 'bg-gray-700'
                  }`}>
                    <Code className={`w-6 h-6 ${pixel.isActive ? 'text-green-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{pixel.name}</p>
                    <p className="text-gray-500 text-sm">{getPlatformLabel(pixel.platform)}</p>
                    <p className="text-gray-600 text-xs font-mono">{pixel.pixelId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggle(pixel)}
                    className={pixel.isActive ? 'text-green-400' : 'text-gray-500'}
                  >
                    {pixel.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(pixel)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: pixel.id })}
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
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingPixel ? 'Editar Pixel' : 'Novo Pixel'}
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
                  placeholder="Ex: Facebook Pixel Principal"
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Plataforma</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="facebook">Facebook Pixel</option>
                  <option value="google_analytics">Google Analytics</option>
                  <option value="google_tag_manager">Google Tag Manager</option>
                  <option value="tiktok">TikTok Pixel</option>
                  <option value="custom">Script Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ID do Pixel</label>
                <Input
                  value={formData.pixelId}
                  onChange={(e) => setFormData({ ...formData, pixelId: e.target.value })}
                  placeholder="Ex: 1234567890123456"
                  className="bg-gray-800 border-gray-700 text-white font-mono"
                  required
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
                <label htmlFor="isActive" className="text-gray-300">Pixel ativo</label>
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
                  {editingPixel ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
