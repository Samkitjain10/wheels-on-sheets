import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Clock, MapPin, Users } from "lucide-react";

interface TrainArrival {
  id: string;
  trainNumber: string;
  trainName: string;
  station: string;
  scheduledTime: string;
  status: 'On Time' | 'Delayed' | 'Arrived';
  guestCount: number;
  delay?: number;
  platform?: string;
}

interface TrainArrivalsProps {
  arrivals: TrainArrival[];
}

export const TrainArrivals = ({ arrivals }: TrainArrivalsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-success text-success-foreground';
      case 'Delayed': return 'bg-warning text-warning-foreground';
      case 'Arrived': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Train className="w-5 h-5" />
          Train Arrivals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {arrivals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Train className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No upcoming train arrivals</p>
            </div>
          ) : (
            arrivals.map((arrival) => (
              <div key={arrival.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">
                      {arrival.trainNumber} - {arrival.trainName}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{arrival.station}</span>
                      {arrival.platform && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          Platform {arrival.platform}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(arrival.status)}>
                    {arrival.status}
                    {arrival.delay && arrival.status === 'Delayed' && ` (+${arrival.delay}m)`}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Scheduled Time:</span>
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(arrival.scheduledTime)}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Guest Count:</span>
                    <div className="font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {arrival.guestCount} passengers
                    </div>
                  </div>
                </div>

                {arrival.status === 'Delayed' && arrival.delay && (
                  <div className="bg-warning-light p-2 rounded text-sm">
                    <strong>Delay Alert:</strong> Train is running {arrival.delay} minutes late. 
                    Pickup assignments may need adjustment.
                  </div>
                )}

                {arrival.status === 'Arrived' && (
                  <div className="bg-success-light p-2 rounded text-sm">
                    <strong>Arrived:</strong> Guests are ready for pickup. 
                    Coordinate with assigned driver immediately.
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};