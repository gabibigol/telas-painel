import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Loader2,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

export default function Produtos() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: 0,
    sku: '',
    categoryId: undefined as number | undefined,
    imageUrl: '',
    status: 'active' as 'active' | 'inactive' | 'out_of_stock',
    isFeatured: false,
    discount: 0,
  });

  const { data: products, isLoading, refetch } = trpc.products.list.useQuery({ search: search || undefined });
  const { data: categories } = trpc.categories.list.useQuery();
  
  const uploadMutation = trpc.storage.upload.useMutation();
  
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success('Produto criado com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao criar produto');
    }
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success('Produto atualizado com sucesso!');
      setIsModalOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar produto');
    }
  });

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success('Produto excluído com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao excluir produto');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: 0,
      sku: '',
      categoryId: undefined,
      imageUrl: '',
      status: 'active',
      isFeatured: false,
      discount: 0,
    });
    setEditingProduct(null);
    setPreviewImage(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock || 0,
      sku: product.sku || '',
      categoryId: product.categoryId || undefined,
      imageUrl: product.imageUrl || '',
      status: product.status || 'active',
      isFeatured: product.isFeatured || false,
      discount: product.discount || 0,
    });
    setPreviewImage(product.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for upload
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });

      // Upload to S3
      const result = await uploadMutation.mutateAsync({
        fileName: file.name,
        fileData: base64,
        contentType: file.type,
        folder: 'products',
      });

      setFormData({ ...formData, imageUrl: result.url });
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar imagem');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
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
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteMutation.mutate({ id });
    }
  };

  const formatPrice = (price: string | number | null) => {
    if (!price) return 'R$ 0,00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400',
      inactive: 'bg-gray-500/20 text-gray-400',
      out_of_stock: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      out_of_stock: 'Sem Estoque',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.inactive}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <AdminLayout title="Produtos" subtitle="Gerencie os produtos da sua loja">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Button onClick={openCreateModal} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Package className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum produto encontrado</p>
            <Button onClick={openCreateModal} variant="link" className="mt-2 text-primary">
              Criar primeiro produto
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Produto</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">SKU</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Preço</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Estoque</th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium text-sm">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-500 text-sm">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{product.sku || '-'}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-gray-500 text-sm line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${product.stock <= 10 ? 'text-red-400' : 'text-white'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(product.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(product)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Imagem do Produto</label>
                <div className="flex items-start gap-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors flex items-center justify-center overflow-hidden ${
                      previewImage || formData.imageUrl 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-600 hover:border-gray-500 bg-gray-800'
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    ) : previewImage || formData.imageUrl ? (
                      <img 
                        src={previewImage || formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="w-8 h-8 mx-auto text-gray-500 mb-1" />
                        <span className="text-xs text-gray-500">Clique para enviar</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-2">
                      Arraste uma imagem ou clique para fazer upload.
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Formatos: JPG, PNG, GIF. Máximo: 5MB
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value });
                          setPreviewImage(e.target.value);
                        }}
                        placeholder="Ou cole a URL da imagem"
                        className="bg-gray-800 border-gray-700 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do produto"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">SKU</label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-001"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Preço *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="99.90"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Preço Original</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="149.90"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Estoque</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="out_of_stock">Sem Estoque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Desconto (%)</label>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isFeatured" className="text-sm text-gray-300">Produto em Destaque</label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90"
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
