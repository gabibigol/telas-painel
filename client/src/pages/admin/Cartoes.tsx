import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

const transactions = [
  { id: 'TXN001', card: '**** **** **** 4532', brand: 'Visa', value: 'R$ 149,90', status: 'Aprovado', date: '20/01/2026 14:32' },
  { id: 'TXN002', card: '**** **** **** 8721', brand: 'Mastercard', value: 'R$ 89,90', status: 'Aprovado', date: '20/01/2026 13:15' },
  { id: 'TXN003', card: '**** **** **** 3456', brand: 'Elo', value: 'R$ 259,90', status: 'Recusado', date: '20/01/2026 12:45' },
  { id: 'TXN004', card: '**** **** **** 9012', brand: 'Visa', value: 'R$ 199,90', status: 'Pendente', date: '20/01/2026 11:20' },
  { id: 'TXN005', card: '**** **** **** 5678', brand: 'Mastercard', value: 'R$ 129,90', status: 'Aprovado', date: '19/01/2026 18:45' },
];

const stats = [
  { label: 'Transações Aprovadas', value: '1.234', percentage: '92%', color: 'text-green-400' },
  { label: 'Transações Recusadas', value: '89', percentage: '6%', color: 'text-red-400' },
  { label: 'Transações Pendentes', value: '23', percentage: '2%', color: 'text-yellow-400' },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Aprovado': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'Recusado': return <XCircle className="w-4 h-4 text-red-400" />;
    case 'Pendente': return <Clock className="w-4 h-4 text-yellow-400" />;
    default: return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aprovado': return 'bg-green-500/20 text-green-400';
    case 'Recusado': return 'bg-red-500/20 text-red-400';
    case 'Pendente': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

export default function Cartoes() {
  return (
    <AdminLayout title="Cartões">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.percentage} do total</p>
                </div>
                <CreditCard className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">ID</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Cartão</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Bandeira</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Valor</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Status</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3 px-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4 text-white font-mono">{txn.id}</td>
                    <td className="py-3 px-4 text-gray-300">{txn.card}</td>
                    <td className="py-3 px-4 text-gray-400">{txn.brand}</td>
                    <td className="py-3 px-4 text-green-400 font-medium">{txn.value}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(txn.status)}`}>
                        {getStatusIcon(txn.status)}
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
