import { EtaView } from "@/components/EtaView";
import { useTasks } from "@/hooks/useTasks";
import { useMemo, useState, useEffect } from "react";
import { MapboxService, TrafficAlert } from "@/lib/mapbox";
import { AlertTriangle, Clock, MapPin, Car } from "lucide-react";

const EtaPage = () => {
  const { tasks, loading, error } = useTasks();
  
  // Traffic alerts state
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>([]);
  const [trafficLoading, setTrafficLoading] = useState(false);

  // Filter active tasks and transform them for ETA view
  const activeTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    return tasks
      .filter(task => task.status === 'Active' || task.status === 'In Progress')
      .map(task => ({
        id: task.id,
        driver: task.assignedDriver,
        type: task.type as 'Guest Pickup' | 'Item Pickup',
        location: task.location,
        scheduledTime: task.time || 'TBD',
        eta: task.estimatedEta || 'Calculating...',
        status: getEtaStatus(task),
        guestCount: task.passengerCount ? parseInt(task.passengerCount) : undefined,
        itemDescription: task.itemName,
        mapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(task.location)}`,
        priority: task.priority,
        notes: task.notes,
        date: task.date
      }));
  }, [tasks]);

  // Calculate ETA status based on task data
  const getEtaStatus = (task: any) => {
    if (!task.time || !task.estimatedEta) return 'Pending';
    
    const scheduled = new Date(task.time);
    const estimated = new Date(task.estimatedEta);
    const now = new Date();
    
    if (estimated < scheduled) return 'On Time';
    if (estimated > scheduled) return 'Delayed';
    return 'At Risk';
  };

  // Fetch traffic alerts for active tasks
  const fetchTrafficAlerts = async () => {
    if (activeTasks.length === 0) return;
    
    setTrafficLoading(true);
    try {
      const allAlerts: TrafficAlert[] = [];
      
      // Get traffic alerts for each active task location
      for (const task of activeTasks) {
        // For now, we'll use simulated coordinates for Rajasthan area
        // In a real implementation, you'd get coordinates from the task location
        const coordinates: [number, number] = [75.7873, 26.9124]; // Bhilwara area
        
        const alerts = await MapboxService.getTrafficAlerts(coordinates);
        allAlerts.push(...alerts);
      }
      
      // Remove duplicates and sort by severity
      const uniqueAlerts = allAlerts.filter((alert, index, self) => 
        index === self.findIndex(a => a.description === alert.description)
      );
      
      uniqueAlerts.sort((a, b) => {
        const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
      
      setTrafficAlerts(uniqueAlerts);
    } catch (error) {
      console.error('Error fetching traffic alerts:', error);
    } finally {
      setTrafficLoading(false);
    }
  };

  // Fetch traffic alerts when active tasks change
  useEffect(() => {
    if (activeTasks.length > 0) {
      fetchTrafficAlerts();
    }
  }, [activeTasks]);

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Live ETA Tracking
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time tracking of all active tasks from Google Sheets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main ETA View */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-card rounded-lg p-6 shadow-card text-center">
                <div className="text-lg font-semibold mb-2">Loading active tasks...</div>
                <div className="text-muted-foreground">Fetching data from Google Sheets</div>
              </div>
            ) : error ? (
              <div className="bg-card rounded-lg p-6 shadow-card text-center">
                <div className="text-lg font-semibold mb-2 text-red-500">Error loading tasks</div>
                <div className="text-muted-foreground">{error}</div>
              </div>
            ) : (
              <EtaView activeTasks={activeTasks} />
            )}
          </div>

          {/* Traffic Alerts */}
          <div className="bg-card rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-red-600" />
              <h2 className="text-2xl font-semibold">Live Traffic Alerts</h2>
              {trafficLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              )}
            </div>
            
            {trafficAlerts.length > 0 ? (
              <div className="space-y-3">
                {trafficAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' 
                        ? 'border-l-red-500 bg-red-50' 
                        : alert.severity === 'medium'
                        ? 'border-l-yellow-500 bg-yellow-50'
                        : 'border-l-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alert.severity === 'high'
                              ? 'bg-red-100 text-red-800'
                              : alert.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{alert.description}</p>
                        <p className="text-xs text-gray-500">Location: {alert.location}</p>
                        <p className="text-xs text-gray-500">
                          Estimated Delay: {alert.estimatedDelay} minutes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {trafficLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span>Fetching traffic alerts...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Car className="w-8 h-8 text-gray-300" />
                    <span>No traffic alerts at the moment</span>
                    <span className="text-xs">Traffic conditions are normal</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ETA Statistics */}
          <div className="bg-card rounded-lg p-6 shadow-card">
            <h2 className="text-2xl font-semibold mb-4">ETA Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">On Time</span>
                <span className="font-bold text-success">
                  {activeTasks.filter(t => t.status === 'On Time').length} tasks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delayed</span>
                <span className="font-bold text-destructive">
                  {activeTasks.filter(t => t.status === 'Delayed').length} tasks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">At Risk</span>
                <span className="font-bold text-warning">
                  {activeTasks.filter(t => t.status === 'At Risk').length} tasks
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Active</span>
                  <span className="font-bold">{activeTasks.length} tasks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtaPage;