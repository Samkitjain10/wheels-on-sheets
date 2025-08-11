import { DriverCard } from "@/components/DriverCard";

const mockDrivers = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    status: 'Available' as const,
    carCapacity: 4,
    currentTasks: 0,
    currentLocation: 'Wedding Venue',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    status: 'Available' as const,
    carCapacity: 7,
    currentTasks: 0,
    currentLocation: 'Wedding Venue',
  },
  {
    id: '3',
    name: 'Vikash Singh',
    status: 'Busy' as const,
    carCapacity: 4,
    currentTasks: 1,
    currentLocation: 'En route to Banton',
    estimatedReturn: '4:30 PM',
  },
  {
    id: '4',
    name: 'Suresh Patel',
    status: 'Busy' as const,
    carCapacity: 6,
    currentTasks: 1,
    currentLocation: 'Bhilwara',
    estimatedReturn: '6:00 PM',
  },
];

const DriversPage = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Driver Overview
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor all drivers, their status, and current assignments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>

        <div className="bg-card rounded-lg p-6 shadow-card">
          <h2 className="text-2xl font-semibold mb-4">Driver Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-available-light rounded-lg">
              <div className="text-2xl font-bold text-available">
                {mockDrivers.filter(d => d.status === 'Available').length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center p-4 bg-busy-light rounded-lg">
              <div className="text-2xl font-bold text-busy">
                {mockDrivers.filter(d => d.status === 'Busy').length}
              </div>
              <div className="text-sm text-muted-foreground">Busy</div>
            </div>
            <div className="text-center p-4 bg-accent-light rounded-lg">
              <div className="text-2xl font-bold text-accent-foreground">
                {mockDrivers.reduce((sum, d) => sum + d.carCapacity, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </div>
            <div className="text-center p-4 bg-success-light rounded-lg">
              <div className="text-2xl font-bold text-success">
                {mockDrivers.reduce((sum, d) => sum + d.currentTasks, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Active Tasks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversPage;