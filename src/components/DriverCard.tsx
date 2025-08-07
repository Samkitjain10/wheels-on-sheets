import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Users, Clock, MapPin } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  status: 'Available' | 'Busy';
  carCapacity: number;
  currentTasks: number;
  currentLocation?: string;
  estimatedReturn?: string;
}

interface DriverCardProps {
  driver: Driver;
}

export const DriverCard = ({ driver }: DriverCardProps) => {
  const statusVariant = driver.status === 'Available' ? 'available' : 'busy';
  
  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{driver.name}</CardTitle>
          <Badge 
            variant={statusVariant}
            className={`
              ${driver.status === 'Available' 
                ? 'bg-available text-available-foreground' 
                : 'bg-busy text-busy-foreground'
              }
            `}
          >
            {driver.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Car className="w-4 h-4" />
          <span>Capacity: {driver.carCapacity} passengers</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Active Tasks: {driver.currentTasks}</span>
        </div>
        
        {driver.currentLocation && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{driver.currentLocation}</span>
          </div>
        )}
        
        {driver.estimatedReturn && driver.status === 'Busy' && (
          <div className="flex items-center gap-2 text-sm text-warning">
            <Clock className="w-4 h-4" />
            <span>ETA Return: {driver.estimatedReturn}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};