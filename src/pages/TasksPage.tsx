import { useState } from "react";
import { TaskForm } from "@/components/TaskForm";

const mockDrivers = [
  { id: '1', name: 'Ramesh Kumar', status: 'Available' },
  { id: '2', name: 'Priya Sharma', status: 'Available' },
  { id: '3', name: 'Vikash Singh', status: 'Busy' },
  { id: '4', name: 'Suresh Patel', status: 'Busy' },
];

const mockTasks = [
  {
    id: '1',
    type: 'Guest Pickup' as const,
    location: 'Banton Railway Station',
    time: '2024-12-15T15:30',
    guestCount: 3,
    assignedTo: 'Vikash Singh',
    status: 'In Progress',
    createdAt: '2024-12-15T14:00:00',
  },
  {
    id: '2',
    type: 'Item Pickup' as const,
    location: 'Catering Service, Bhilwara',
    time: '2024-12-15T17:00',
    itemDescription: 'Wedding decoration items',
    assignedTo: 'Suresh Patel',
    status: 'Scheduled',
    createdAt: '2024-12-15T14:15:00',
  },
  {
    id: '3',
    type: 'Guest Pickup' as const,
    location: 'Ajmer Airport',
    time: '2024-12-15T19:30',
    guestCount: 5,
    assignedTo: 'Auto-assign',
    status: 'Pending',
    createdAt: '2024-12-15T14:30:00',
  },
];

const TasksPage = () => {
  const [tasks, setTasks] = useState(mockTasks);

  const handleTaskCreate = (taskData: any) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      assignedTo: taskData.assignTo || 'Auto-assign',
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-warning text-warning-foreground';
      case 'Scheduled': return 'bg-success text-success-foreground';
      case 'Pending': return 'bg-destructive text-destructive-foreground';
      case 'Completed': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Task Manager
          </h1>
          <p className="text-lg text-muted-foreground">
            Create, assign, and monitor all wedding logistics tasks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Creation Form */}
          <div>
            <TaskForm drivers={mockDrivers} onTaskCreate={handleTaskCreate} />
          </div>

          {/* Task List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Current Tasks</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="bg-card rounded-lg p-4 shadow-card border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{task.type}</h3>
                      <p className="text-muted-foreground">{task.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="ml-2 font-medium">
                        {new Date(task.time).toLocaleString()}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="ml-2 font-medium">{task.assignedTo}</span>
                    </div>

                    {task.guestCount && (
                      <div>
                        <span className="text-muted-foreground">Guests:</span>
                        <span className="ml-2 font-medium">{task.guestCount} passengers</span>
                      </div>
                    )}

                    {task.itemDescription && (
                      <div>
                        <span className="text-muted-foreground">Items:</span>
                        <span className="ml-2">{task.itemDescription}</span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;