import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ExternalLink, AlertTriangle } from "lucide-react";

interface ActiveTask {
  id: string;
  driver: string;
  type: 'Guest Pickup' | 'Item Pickup';
  location: string;
  scheduledTime: string;
  eta: string;
  status: 'On Time' | 'Delayed' | 'At Risk';
  guestCount?: number;
  itemDescription?: string;
  mapsUrl: string;
}

interface EtaViewProps {
  activeTasks: ActiveTask[];
}

export const EtaView = ({ activeTasks }: EtaViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-success text-success-foreground';
      case 'Delayed': return 'bg-destructive text-destructive-foreground';
      case 'At Risk': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Live ETA Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No active tasks at the moment</p>
            </div>
          ) : (
            activeTasks.map((task) => (
              <div key={task.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{task.driver}</h4>
                      <Badge variant="outline" className="text-xs">
                        {task.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{task.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    {task.status === 'At Risk' && (
                      <div className="flex items-center gap-1 text-warning text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Traffic Alert</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Scheduled:</span>
                    <div className="font-medium">{task.scheduledTime}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ETA:</span>
                    <div className="font-medium">{task.eta}</div>
                  </div>
                </div>

                {task.guestCount && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="ml-2 font-medium">{task.guestCount} passengers</span>
                  </div>
                )}

                {task.itemDescription && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="ml-2">{task.itemDescription}</span>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(task.mapsUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Route in Google Maps
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};