import { Card } from "../ui/card";
import { Users, Wallet, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalRegistrations: number;
  totalRevenue: number;
  totalCapacity: number;
}

export function DashboardStats({
  totalRegistrations,
  totalRevenue,
  totalCapacity,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Users className="h-10 w-10 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total de Inscrições</p>
            <h3 className="text-2xl font-bold">{totalRegistrations}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Wallet className="h-10 w-10 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Receita Total</p>
            <h3 className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <TrendingUp className="h-10 w-10 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Capacidade Total</p>
            <h3 className="text-2xl font-bold">{totalCapacity}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
}
