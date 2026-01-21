import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye, Clock, MousePointer } from 'lucide-react';

const metrics = [
  { label: 'Visitantes Únicos', value: '12.543', change: '+8.2%', icon: Users },
  { label: 'Visualizações de Página', value: '45.231', change: '+15.3%', icon: Eye },
  { label: 'Tempo Médio na Página', value: '3m 42s', change: '+5.1%', icon: Clock },
  { label: 'Taxa de Cliques', value: '4.8%', change: '+2.3%', icon: MousePointer },
];

const trafficSources = [
  { source: 'Busca Orgânica', visits: 5234, percentage: 42 },
  { source: 'Redes Sociais', visits: 3421, percentage: 27 },
  { source: 'Tráfego Direto', visits: 2156, percentage: 17 },
  { source: 'Referências', visits: 1098, percentage: 9 },
  { source: 'Email Marketing', visits: 634, percentage: 5 },
];

export default function Analise() {
  return (
    <AdminLayout title="Análise">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{metric.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                    <p className="text-green-400 text-sm mt-1">{metric.change}</p>
                  </div>
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Traffic Sources */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Fontes de Tráfego
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{source.source}</span>
                  <span className="text-gray-400">{source.visits.toLocaleString()} visitas ({source.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
