import { useState } from "react";
import { DriverCard } from "@/components/DriverCard";
import { TaskForm } from "@/components/TaskForm";
import { EtaView } from "@/components/EtaView";
import { AiAssistant } from "@/components/AiAssistant";
import { TrainArrivals } from "@/components/TrainArrivals";
import { MessageLog } from "@/components/MessageLog";

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
];

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
];

const Index = () => {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [activeTasks, setActiveTasks] = useState(mockActiveTasks);
  const [messages, setMessages] = useState(mockMessages);

  const handleTaskCreate = (taskData: any) => {
    console.log('New task created:', taskData);
    // In real app, this would sync with Google Sheets via n8n
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Wedding Logistics Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage drivers, tasks, and guest coordination seamlessly
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Driver Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                Driver Overview
              </h2>
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </div>
            </div>

            {/* Task Manager */}
            <TaskForm drivers={drivers} onTaskCreate={handleTaskCreate} />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Live ETA View */}
            <EtaView activeTasks={activeTasks} />
            
            {/* Train Arrivals */}
            <TrainArrivals arrivals={mockTrainArrivals} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <AiAssistant />
            
            {/* Message Log */}
            <MessageLog messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;