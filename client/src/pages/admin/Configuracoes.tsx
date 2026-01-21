import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { 
  Loader2,
  Save,
  Store,
  Palette,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    currency: 'BRL',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    primaryColor: '#FE2C55',
    secondaryColor: '#25F4EE',
    logoUrl: '',
    faviconUrl: '',
    metaTitle: '',
    metaDescription: '',
    enableNotifications: true,
    enableEmailMarketing: false,
    maintenanceMode: false,
  });

  const { data: allSettings, isLoading, refetch } = trpc.storeSettings.list.useQuery({});
  
  // Parse settings into a more usable format
  const settings = allSettings?.reduce((acc: any, setting: any) => {
    acc[setting.key] = setting.type === 'boolean' ? setting.value === 'true' : setting.value;
    return acc;
  }, {}) || {};
  
  const updateMutation = trpc.storeSettings.upsert.useMutation({
    onSuccess: () => {
      toast.success('Configurações salvas com sucesso!');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao salvar configurações');
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || '',
        storeDescription: settings.storeDescription || '',
        storeEmail: settings.storeEmail || '',
        storePhone: settings.storePhone || '',
        storeAddress: settings.storeAddress || '',
        currency: settings.currency || 'BRL',
        language: settings.language || 'pt-BR',
        timezone: settings.timezone || 'America/Sao_Paulo',
        primaryColor: settings.primaryColor || '#FE2C55',
        secondaryColor: settings.secondaryColor || '#25F4EE',
        logoUrl: settings.logoUrl || '',
        faviconUrl: settings.faviconUrl || '',
        metaTitle: settings.metaTitle || '',
        metaDescription: settings.metaDescription || '',
        enableNotifications: settings.enableNotifications ?? true,
        enableEmailMarketing: settings.enableEmailMarketing ?? false,
        maintenanceMode: settings.maintenanceMode ?? false,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save each setting individually
    const settingsToSave = Object.entries(formData).map(([key, value]) => ({
      key,
      value: typeof value === 'boolean' ? String(value) : String(value),
      type: typeof value === 'boolean' ? 'boolean' as const : 'string' as const,
      category: 'general',
    }));
    
    for (const setting of settingsToSave) {
      await updateMutation.mutateAsync(setting);
    }
    toast.success('Configurações salvas com sucesso!');
    refetch();
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Store },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'notifications', label: 'Notificações', icon: Bell },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Configurações" subtitle="Personalize sua loja">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configurações" subtitle="Personalize sua loja">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Store className="w-5 h-5" />
                Informações da Loja
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nome da Loja</label>
                  <Input
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="Minha Loja"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.storeEmail}
                    onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                    placeholder="contato@minhaloja.com"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                  <Input
                    value={formData.storePhone}
                    onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Moeda</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dólar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <textarea
                  value={formData.storeDescription}
                  onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                  placeholder="Descrição da sua loja..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Endereço</label>
                <Input
                  value={formData.storeAddress}
                  onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                  placeholder="Rua Exemplo, 123 - São Paulo, SP"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4">SEO</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Título da Página</label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Minha Loja - Os Melhores Produtos"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Meta Descrição</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Descrição para mecanismos de busca..."
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Cores
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Cor Primária</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      placeholder="#FE2C55"
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Cor Secundária</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      placeholder="#25F4EE"
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Imagens</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">URL do Logo</label>
                  <Input
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://exemplo.com/logo.png"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">URL do Favicon</label>
                  <Input
                    value={formData.faviconUrl}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    placeholder="https://exemplo.com/favicon.ico"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferências de Notificação
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Notificações Push</p>
                    <p className="text-gray-500 text-sm">Receber notificações de novos pedidos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableNotifications}
                      onChange={(e) => setFormData({ ...formData, enableNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Email Marketing</p>
                    <p className="text-gray-500 text-sm">Enviar emails promocionais para clientes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableEmailMarketing}
                      onChange={(e) => setFormData({ ...formData, enableEmailMarketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-yellow-500/30">
                  <div>
                    <p className="text-white font-medium">Modo Manutenção</p>
                    <p className="text-yellow-500 text-sm">A loja ficará offline para visitantes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.maintenanceMode}
                      onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Configurações
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
