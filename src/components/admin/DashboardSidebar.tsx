import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "../ThemeToggle";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  icon: any;
  label: string;
  value: string;
  count?: number;
}

interface DashboardSidebarProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  menuItems: MenuItem[];
}

export function DashboardSidebar({
  selectedTab,
  onTabChange,
  menuItems,
}: DashboardSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-card border-r min-h-screen p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Admin</h2>
        <ThemeToggle />
      </div>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.value}
            variant={selectedTab === item.value ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              selectedTab === item.value
                ? "bg-primary text-primary-foreground"
                : "",
            )}
            onClick={() => onTabChange(item.value)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
            {item.count !== undefined && (
              <Badge variant="secondary" className="ml-auto bg-background/20">
                {item.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100"
        onClick={() => navigate("/")}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}
