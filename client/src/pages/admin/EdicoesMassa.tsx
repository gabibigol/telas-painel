import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileEdit, Upload, Download, RefreshCw } from 'lucide-react';

const recentOperations = [
  { id: 1, type: 'Atualização de Preços', items: 234, status: 'Concluído', date: '20/01/2026 14:32' },
  { id: 2, type: 'Atualização de Estoque', items: 156, status: 'Concluído', date: '19/01/2026 10:15' },
  { id: 3, type: 'Importação de Produtos', items: 45, status: 'Em Progresso', date: '18/01/2026 16:45' },
  { id: 4, type: 'Alteração de Categorias', items: 89, status: 'Concluído', date: '17/01/2026 09:20' },
];

export default function EdicoesMassa() {
  return (
    <AdminLayout title="Edições em Massa">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Importar Produtos</p>
                <p className="text-gray-500 text-sm">CSV ou Excel</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              Selecionar Arquivo
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Exportar Produtos</p>
                <p className="text-gray-500 text-sm">Baixar planilha</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              Exportar CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Atualizar Preços</p>
                <p className="text-gray-500 text-sm">Percentual ou fixo</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              Configurar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Price Update */}
      <Card className="bg-gray-800/50 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Atualização de Preços em Massa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-400">Tipo de Ajuste</Label>
              <select className="w-full mt-1 bg-gray-700/50 border border-gray-600 text-white rounded-md p-2">
                <option value="percent">Percentual (%)</option>
                <option value="fixed">Valor Fixo (R$)</option>
              </select>
            </div>
            <div>
              <Label className="text-gray-400">Valor</Label>
              <Input 
                type="number"
                placeholder="Ex: 10" 
                className="mt-1 bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-400">Categoria</Label>
              <select className="w-full mt-1 bg-gray-700/50 border border-gray-600 text-white rounded-md p-2">
                <option value="all">Todas as Categorias</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="beleza">Beleza</option>
                <option value="moda">Moda</option>
              </select>
            </div>
          </div>
          <Button className="mt-4 bg-primary hover:bg-primary/90">
            Aplicar Alterações
          </Button>
        </CardContent>
      </Card>

      {/* Recent Operations */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileEdit className="w-5 h-5" />
            Operações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOperations.map((op) => (
              <div key={op.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{op.type}</p>
                  <p className="text-gray-500 text-sm">{op.items} itens afetados</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    op.status === 'Concluído' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {op.status}
                  </span>
                  <p className="text-gray-500 text-xs mt-1">{op.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
