import { MessageLog } from "@/components/MessageLog";

const mockMessages = [
  {
    id: '1',
    timestamp: '2024-12-15T15:30:00',
    driverName: 'Ramesh Kumar',
    message: 'Pickup confirmed for 3:30 PM at Banton Railway Station. Guest count: 3 passengers.',
    status: 'Read' as const,
  },
  {
    id: '2',
    timestamp: '2024-12-15T15:25:00',
    driverName: 'Vikash Singh',
    message: 'Starting journey to pickup location. ETA 20 minutes.',
    status: 'Delivered' as const,
  },
  {
    id: '3',
    timestamp: '2024-12-15T15:20:00',
    driverName: 'Priya Sharma',
    message: 'Standing by at venue. Ready for next assignment.',
    status: 'Read' as const,
  },
  {
    id: '4',
    timestamp: '2024-12-15T15:15:00',
    driverName: 'Suresh Patel',
    message: 'Traffic delay on NH-8. Will reach Bhilwara 10 minutes late.',
    status: 'Delivered' as const,
  },
  {
    id: '5',
    timestamp: '2024-12-15T15:10:00',
    driverName: 'Ramesh Kumar',
    message: 'Guest pickup completed successfully. Heading back to venue.',
    status: 'Read' as const,
  },
  {
    id: '6',
    timestamp: '2024-12-15T15:05:00',
    driverName: 'Vikash Singh',
    message: 'Arrived at pickup location. Waiting for guests.',
    status: 'Delivered' as const,
  },
  {
    id: '7',
    timestamp: '2024-12-15T15:00:00',
    driverName: 'Priya Sharma',
    message: 'Car refueled and ready for evening assignments.',
    status: 'Read' as const,
  },
  {
    id: '8',
    timestamp: '2024-12-15T14:55:00',
    driverName: 'Suresh Patel',
    message: 'Decoration items loaded. Proceeding to venue.',
    status: 'Failed' as const,
  },
];

const MessagesPage = () => {
  const sentCount = mockMessages.filter(m => m.status === 'Delivered').length;
  const deliveredCount = mockMessages.filter(m => m.status === 'Delivered').length;
  const readCount = mockMessages.filter(m => m.status === 'Read').length;
  const failedCount = mockMessages.filter(m => m.status === 'Failed').length;

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Message Log
          </h1>
          <p className="text-lg text-muted-foreground">
            WhatsApp communication tracking with drivers
          </p>
        </div>

        {/* Message Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-muted-foreground">{sentCount}</div>
            <div className="text-sm text-muted-foreground">Sent</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-success">{deliveredCount}</div>
            <div className="text-sm text-muted-foreground">Delivered</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-accent">{readCount}</div>
            <div className="text-sm text-muted-foreground">Read</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-destructive">{failedCount}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Message Log */}
          <div className="lg:col-span-2">
            <MessageLog messages={mockMessages} />
          </div>

          {/* Message Templates & Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Quick Templates</h2>
              <div className="space-y-3">
                <div className="p-3 bg-accent-light rounded border border-accent cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                  <h3 className="font-medium text-sm">Pickup Confirmation</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Your pickup is confirmed for [TIME] at [LOCATION]"
                  </p>
                </div>
                <div className="p-3 bg-success-light rounded border border-success cursor-pointer hover:bg-success hover:text-success-foreground transition-colors">
                  <h3 className="font-medium text-sm">En Route Update</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Driver is on the way. ETA: [TIME]"
                  </p>
                </div>
                <div className="p-3 bg-warning-light rounded border border-warning cursor-pointer hover:bg-warning hover:text-warning-foreground transition-colors">
                  <h3 className="font-medium text-sm">Delay Notification</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Slight delay due to traffic. New ETA: [TIME]"
                  </p>
                </div>
                <div className="p-3 bg-primary-light rounded border border-primary cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                  <h3 className="font-medium text-sm">Completed Pickup</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    "Guests picked up successfully. Heading to venue."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">WhatsApp Integration</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>WhatsApp Business API connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Message delivery tracking active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Auto-retry for failed messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>1 message requires attention</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Driver Response Times</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ramesh Kumar</span>
                  <span className="text-success font-medium">2 min avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Priya Sharma</span>
                  <span className="text-success font-medium">3 min avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Vikash Singh</span>
                  <span className="text-warning font-medium">8 min avg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Suresh Patel</span>
                  <span className="text-destructive font-medium">No response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;