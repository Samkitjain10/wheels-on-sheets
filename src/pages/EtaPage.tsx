import { EtaView } from "@/components/EtaView";

const mockActiveTasks = [
  {
    id: '1',
    driver: 'Vikash Singh',
    type: 'Guest Pickup' as const,
    location: 'Banton Railway Station',
    scheduledTime: '3:30 PM',
    eta: '3:25 PM',
    status: 'On Time' as const,
    guestCount: 3,
    mapsUrl: 'https://goo.gl/maps/example1',
  },
  {
    id: '2',
    driver: 'Suresh Patel',
    type: 'Item Pickup' as const,
    location: 'Catering Service, Bhilwara',
    scheduledTime: '5:00 PM',
    eta: '5:15 PM',
    status: 'At Risk' as const,
    itemDescription: 'Wedding decoration items',
    mapsUrl: 'https://goo.gl/maps/example2',
  },
  {
    id: '3',
    driver: 'Ramesh Kumar',
    type: 'Guest Pickup' as const,
    location: 'Ajmer Airport',
    scheduledTime: '7:00 PM',
    eta: '6:55 PM',
    status: 'On Time' as const,
    guestCount: 8,
    mapsUrl: 'https://goo.gl/maps/example3',
  },
  {
    id: '4',
    driver: 'Priya Sharma',
    type: 'Guest Pickup' as const,
    location: 'Jodhpur Bus Stand',
    scheduledTime: '8:30 PM',
    eta: '8:45 PM',
    status: 'Delayed' as const,
    guestCount: 6,
    mapsUrl: 'https://goo.gl/maps/example4',
  },
];

const EtaPage = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Live ETA Tracking
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time tracking of all active tasks with Google Maps integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main ETA View */}
          <div className="lg:col-span-2">
            <EtaView activeTasks={mockActiveTasks} />
          </div>

          {/* Traffic Alerts */}
          <div className="bg-card rounded-lg p-6 shadow-card">
            <h2 className="text-2xl font-semibold mb-4">Traffic Alerts</h2>
            <div className="space-y-3">
              <div className="bg-warning-light p-3 rounded-lg border border-warning">
                <h3 className="font-medium text-warning-foreground">Heavy Traffic on NH-8</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  30-minute delay expected between Ajmer and Pushkar. Consider alternate routes.
                </p>
              </div>
              <div className="bg-destructive-light p-3 rounded-lg border border-destructive">
                <h3 className="font-medium text-destructive-foreground">Road Closure Alert</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Construction work on Station Road. Use bypass route for Bhilwara pickups.
                </p>
              </div>
            </div>
          </div>

          {/* ETA Statistics */}
          <div className="bg-card rounded-lg p-6 shadow-card">
            <h2 className="text-2xl font-semibold mb-4">ETA Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">On Time</span>
                <span className="font-bold text-success">
                  {mockActiveTasks.filter(t => t.status === 'On Time').length} tasks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Delayed</span>
                <span className="font-bold text-destructive">
                  {mockActiveTasks.filter(t => t.status === 'Delayed').length} tasks
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">At Risk</span>
                <span className="font-bold text-warning">
                  {mockActiveTasks.filter(t => t.status === 'At Risk').length} tasks
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Average Delay</span>
                  <span className="font-bold">8 minutes</span>
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