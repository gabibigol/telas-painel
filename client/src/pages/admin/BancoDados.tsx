import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Download, RefreshCw, HardDrive, Clock, AlertTriangle } from 'lucide-react';

const tables = [
  { name: 'users', records: 1234, size: '2.3 MB', lastUpdate: '20/01/2026 14:32' },
  { name: 'products', records: 567, size: '15.8 MB', lastUpdate: '20/01/2026 13:15' },
  { name: 'orders', records: 8945, size: '45.2 MB', lastUpdate: '20/01/2026 14:45' },
  { name: 'categories', records: 23, size: '0.1 MB', lastUpdate: '15/01/2026 10:20' },
  { name: 'cart_items', records: 456, size: '1.2 MB', lastUpdate: '20/01/2026 14:50' },
];

const backups = [
  { id: 1, date: '20/01/2026 00:00', size: '125 MB', status: 'Concluído' },
  { id: 2, date: '19/01/2026 00:00', size: '124 MB', status: 'Concluído' },
  { id: 3, date: '18/01/2026 00:00', size: '123 MB', status: 'Concluído' },
];

export default function BancoDados() {
  return (
    <AdminLayout title="Banco de Dados">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tamanho Total</p>
                <p className="text-2xl font-bold text-white mt-1">64.6 MB</p>
              </div>
              <HardDrive className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Registros</p>
                <p className="text-2xl font-bold text-white mt-1">11.225</p>
              </div>
              <Database className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Último Backup</p>
                <p className="text-2xl font-bold text-white mt-1">Hoje</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-2xl font-bold text-green-400 mt-1">Online</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="bg-gray-800/50 border-gray-700 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Criar Backup
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Otimizar Tabelas
            </Button>
            <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-500/10">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Limpar Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tables */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Tabelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 text-sm font-medium py-2">Tabela</th>
                    <th className="text-left text-gray-400 text-sm font-medium py-2">Registros</th>
                    <th className="text-left text-gray-400 text-sm font-medium py-2">Tamanho</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => (
                    <tr key={table.name} className="border-b border-gray-700/50">
                      <td className="py-2 text-white font-mono text-sm">{table.name}</td>
                      <td className="py-2 text-gray-400">{table.records.toLocaleString()}</td>
                      <td className="py-2 text-gray-400">{table.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Backups */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="w-5 h-5" />
              Backups Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="text-white">{backup.date}</p>
                    <p className="text-gray-500 text-sm">{backup.size}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {backup.status}
                    </span>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
