import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Clock, MapPin, Users, Plane, RefreshCw } from "lucide-react";
import { TransportInfo } from "@/lib/transportTracking";
import { TransportTrackingService } from "@/lib/transportTracking";

interface TrainArrivalsProps {
  arrivals: TransportInfo[];
  onRefresh?: () => void;
  loading?: boolean;
}

export const TrainArrivals = ({ arrivals, onRefresh, loading }: TrainArrivalsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'bg-success text-success-foreground';
      case 'Delayed': return 'bg-warning text-warning-foreground';
      case 'Arrived': return 'bg-accent text-accent-foreground';
      case 'Boarding': return 'bg-blue-500 text-white';
      case 'Departed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransportIcon = (type: 'train' | 'flight') => {
    return type === 'train' ? <Train className="w-4 h-4" /> : <Plane className="w-4 h-4" />;
  };

  const getPlatformInfo = (arrival: TransportInfo) => {
    if (arrival.type === 'flight') {
      return {
        label: 'Gate',
        value: arrival.gate || 'TBD',
        terminal: arrival.terminal
      };
    } else {
      return {
        label: 'Platform',
        value: arrival.platform || 'TBD',
        terminal: null
      };
    }
  };

  const getPickupStatus = (arrival: TransportInfo) => {
    return TransportTrackingService.getPickupStatus(arrival.status, arrival.delay);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5" />
            Transport Arrivals
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 hover:bg-muted rounded-md transition-colors"
              title="Refresh arrivals"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {arrivals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Train className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No upcoming transport arrivals</p>
              <p className="text-sm">Add tasks with train or flight numbers to see arrivals</p>
            </div>
          ) : (
            arrivals.map((arrival) => {
              const platformInfo = getPlatformInfo(arrival);
              const pickupStatus = getPickupStatus(arrival);
              
              return (
                <div key={arrival.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getTransportIcon(arrival.type)}
                        <h4 className="font-medium">
                          {arrival.number} - {arrival.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {arrival.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{arrival.destination}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {platformInfo.label} {platformInfo.value}
                        </span>
                        {platformInfo.terminal && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {platformInfo.terminal}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        From: {arrival.origin}
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(arrival.status)}>
                      {arrival.status}
                      {arrival.delay > 0 && arrival.status === 'Delayed' && ` (+${arrival.delay}m)`}
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

                  {/* Pickup Status */}
                  <div className={`p-3 rounded-lg text-sm ${
                    pickupStatus.priority === 'success' ? 'bg-success-light' :
                    pickupStatus.priority === 'warning' ? 'bg-warning-light' :
                    pickupStatus.priority === 'error' ? 'bg-destructive-light' :
                    'bg-blue-50'
                  }`}>
                    <strong className={`${
                      pickupStatus.priority === 'success' ? 'text-success-foreground' :
                      pickupStatus.priority === 'warning' ? 'text-warning-foreground' :
                      pickupStatus.priority === 'error' ? 'text-destructive-foreground' :
                      'text-blue-800'
                    }`}>
                      {pickupStatus.status}:
                    </strong>
                    <p className={`mt-1 ${
                      pickupStatus.priority === 'success' ? 'text-success-foreground' :
                      pickupStatus.priority === 'warning' ? 'text-warning-foreground' :
                      pickupStatus.priority === 'error' ? 'text-destructive-foreground' :
                      'text-blue-700'
                    }`}>
                      {pickupStatus.message}
                    </p>
                  </div>

                  {/* ETA Information */}
                  <div className="text-xs text-muted-foreground">
                    ETA: {TransportTrackingService.calculateETA(arrival.scheduledTime, arrival.delay)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};