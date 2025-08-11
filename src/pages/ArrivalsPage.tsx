import { TrainArrivals } from "@/components/TrainArrivals";

const mockTrainArrivals = [
  {
    id: '1',
    trainNumber: '12463',
    trainName: 'Rajdhani Express',
    station: 'Ajmer Junction',
    scheduledTime: '2024-12-15T16:30:00',
    status: 'On Time' as const,
    guestCount: 8,
    platform: '2',
  },
  {
    id: '2',
    trainNumber: '14707',
    trainName: 'Ranakpur Express',
    station: 'Bhilwara Station',
    scheduledTime: '2024-12-15T18:45:00',
    status: 'Delayed' as const,
    guestCount: 12,
    delay: 20,
    platform: '1',
  },
  {
    id: '3',
    trainNumber: '12991',
    trainName: 'Udaipur Express',
    station: 'Udaipur City',
    scheduledTime: '2024-12-15T20:15:00',
    status: 'On Time' as const,
    guestCount: 6,
    platform: '3',
  },
  {
    id: '4',
    trainNumber: '19665',
    trainName: 'Kurj Express',
    station: 'Jodhpur Junction',
    scheduledTime: '2024-12-15T21:30:00',
    status: 'Delayed' as const,
    guestCount: 15,
    delay: 45,
    platform: '2',
  },
  {
    id: '5',
    trainNumber: '14805',
    trainName: 'Barmer Express',
    station: 'Jaisalmer',
    scheduledTime: '2024-12-16T07:20:00',
    status: 'Arrived' as const,
    guestCount: 4,
    platform: '1',
  },
];

const ArrivalsPage = () => {
  const onTimeCount = mockTrainArrivals.filter(t => t.status === 'On Time').length;
  const delayedCount = mockTrainArrivals.filter(t => t.status === 'Delayed').length;
  const arrivedCount = mockTrainArrivals.filter(t => t.status === 'Arrived').length;
  const totalGuests = mockTrainArrivals.reduce((sum, t) => sum + t.guestCount, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Train Arrivals
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time tracking of guest arrivals and coordination
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-success">{onTimeCount}</div>
            <div className="text-sm text-muted-foreground">On Time</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-warning">{delayedCount}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-accent">{arrivedCount}</div>
            <div className="text-sm text-muted-foreground">Arrived</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-primary">{totalGuests}</div>
            <div className="text-sm text-muted-foreground">Total Guests</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Train Arrivals */}
          <div className="lg:col-span-2">
            <TrainArrivals arrivals={mockTrainArrivals} />
          </div>

          {/* Station Information */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Station Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ajmer Junction</span>
                  <span className="font-medium">Platform 1-4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bhilwara Station</span>
                  <span className="font-medium">Platform 1-2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Udaipur City</span>
                  <span className="font-medium">Platform 1-3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jodhpur Junction</span>
                  <span className="font-medium">Platform 1-5</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Pickup Coordination</h2>
              <div className="space-y-4">
                <div className="bg-success-light p-3 rounded-lg">
                  <h3 className="font-medium text-success-foreground">Next Pickup</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rajdhani Express - 8 guests
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Driver: Ramesh Kumar assigned
                  </p>
                </div>
                
                <div className="bg-warning-light p-3 rounded-lg">
                  <h3 className="font-medium text-warning-foreground">Attention Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ranakpur Express delayed by 20 minutes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Notify assigned driver
                  </p>
                </div>

                <div className="bg-accent-light p-3 rounded-lg">
                  <h3 className="font-medium text-accent-foreground">Completed</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Barmer Express - 4 guests picked up
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: En route to venue
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Data Source</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Live Train API connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Google Sheets sync active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>n8n automation running</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrivalsPage;