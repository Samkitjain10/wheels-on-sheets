import { TaskForm } from "@/components/TaskForm";
import { useDrivers } from "@/hooks/useDrivers";
import { useTasks } from "@/hooks/useTasks";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const TasksPage = () => {
  const { drivers, loading: driversLoading, error: driversError } = useDrivers();
  const { tasks, loading: tasksLoading, error: tasksError, fetchTasks } = useTasks();
  
  // Sorting state
  const [sortBy, setSortBy] = useState<'priority' | 'status' | 'date' | 'type' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleTaskCreate = async (taskData: any) => {
    // Refresh the tasks list after creating a new task
    await fetchTasks();
  };

  // Sort tasks based on selected criteria
  const sortedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    
    return [...tasks].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'status':
          const statusOrder = { 'Pending': 1, 'In Progress': 2, 'Completed': 3, 'Scheduled': 4 };
          aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
          bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
          break;
        case 'date':
          aValue = a.date ? new Date(a.date).getTime() : 0;
          bValue = b.date ? new Date(b.date).getTime() : 0;
          break;
        case 'type':
          aValue = a.type.toLowerCase();
          bValue = b.type.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [tasks, sortBy, sortOrder]);

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

        {/* Task Creation Form */}
        <div>
          {driversLoading ? (
            <div className="bg-card rounded-lg p-6 shadow-card text-center">
              <div className="text-lg font-semibold mb-2">Loading drivers...</div>
              <div className="text-muted-foreground">Fetching data from Google Sheets</div>
            </div>
          ) : driversError ? (
            <div className="bg-card rounded-lg p-6 shadow-card text-center">
              <div className="text-lg font-semibold mb-2 text-red-500">Error loading drivers</div>
              <div className="text-muted-foreground">{driversError}</div>
            </div>
          ) : (
            <TaskForm onTaskCreate={handleTaskCreate} />
          )}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Current Tasks</h2>
            <button
              onClick={fetchTasks}
              disabled={tasksLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {tasksLoading ? 'Refreshing...' : 'Refresh Tasks'}
            </button>
          </div>
          
          {/* Sorting Controls */}
          <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="date">Task Date</SelectItem>
                  <SelectItem value="type">Task Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              {sortOrder === 'asc' ? (
                <>
                  <ArrowUp className="w-4 h-4" />
                  Ascending
                </>
              ) : (
                <>
                  <ArrowDown className="w-4 h-4" />
                  Descending
                </>
              )}
            </button>
            
            <div className="text-xs text-muted-foreground">
              {sortedTasks.length} task{sortedTasks.length !== 1 ? 's' : ''} • 
              Sorted by {sortBy === 'createdAt' ? 'Created Date' : 
                         sortBy === 'priority' ? 'Priority' : 
                         sortBy === 'status' ? 'Status' : 
                         sortBy === 'date' ? 'Task Date' : 'Task Type'}
            </div>
          </div>
          
          {tasksLoading ? (
            <div className="bg-card rounded-lg p-6 shadow-card text-center">
              <div className="text-lg font-semibold mb-2">Loading tasks...</div>
              <div className="text-muted-foreground">Fetching data from Google Sheets</div>
            </div>
          ) : tasksError ? (
            <div className="bg-card rounded-lg p-6 shadow-card text-center">
              <div className="text-lg font-semibold mb-2 text-red-500">Error loading tasks</div>
              <div className="text-muted-foreground">{tasksError}</div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-card rounded-lg p-6 shadow-card text-center">
              <div className="text-lg font-semibold mb-2">No tasks found</div>
              <div className="text-muted-foreground">Create your first task above</div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {sortedTasks.map((task) => (
                <div key={task.id} className="bg-card rounded-lg p-4 shadow-card border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{task.type}</h3>
                      <p className="text-muted-foreground">{task.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {task.priority && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority} Priority
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {task.type === 'Guest Pickup' && task.passengerName && (
                      <div>
                        <span className="text-muted-foreground">Guest:</span>
                        <span className="ml-2 font-medium">{task.passengerName}</span>
                        {task.passengerCount && (
                          <span className="ml-2">({task.passengerCount} passengers)</span>
                        )}
                      </div>
                    )}
                    
                    {task.type === 'Item Pickup' && task.itemName && (
                      <div>
                        <span className="text-muted-foreground">Item:</span>
                        <span className="ml-2 font-medium">{task.itemName}</span>
                      </div>
                    )}
                    
                    {task.date && (
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <span className="ml-2 font-medium">{task.date}</span>
                      </div>
                    )}
                    
                    {task.time && (
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-2 font-medium">{task.time}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="ml-2 font-medium">{task.assignedDriver}</span>
                    </div>

                    {task.notes && (
                      <div>
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="ml-2">{task.notes}</span>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;