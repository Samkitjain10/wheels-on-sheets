import { useState } from "react";
import { DriverCard } from "@/components/DriverCard";
import { EtaView } from "@/components/EtaView";

// Mock data for demonstration
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
];

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
];

const Index = () => {
  const [drivers] = useState(mockDrivers);
  const [activeTasks] = useState(mockActiveTasks);

  const availableDrivers = drivers.filter(d => d.status === 'Available').length;
  const busyDrivers = drivers.filter(d => d.status === 'Busy').length;
  const totalTasks = activeTasks.length;
  const totalCapacity = drivers.reduce((sum, d) => sum + d.carCapacity, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Wedding Logistics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Quick overview of drivers and active tasks
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-card text-center">
              <div className="text-2xl font-bold text-available">{availableDrivers}</div>
              <div className="text-sm text-muted-foreground">Available Drivers</div>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-card text-center">
              <div className="text-2xl font-bold text-busy">{busyDrivers}</div>
              <div className="text-sm text-muted-foreground">Busy Drivers</div>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-card text-center">
              <div className="text-2xl font-bold text-primary">{totalTasks}</div>
              <div className="text-sm text-muted-foreground">Active Tasks</div>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-card text-center">
              <div className="text-2xl font-bold text-accent-foreground">{totalCapacity}</div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Driver Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Driver Overview</h2>
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            </div>

            {/* Live ETA View */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Live ETA View</h2>
              <EtaView activeTasks={activeTasks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;