import { useState, useEffect } from 'react';
import { useTasks } from './useTasks';
import { TransportTrackingService, TransportInfo } from '@/lib/transportTracking';

export const useTransportTracking = () => {
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const [transportData, setTransportData] = useState<TransportInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch transport data for tasks with train/flight numbers
  const fetchTransportData = async () => {
    if (!tasks || tasks.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Debug logging to see what tasks we have
      console.log('All tasks from Google Sheets:', tasks);
      console.log('Tasks with train/flight numbers:', tasks.filter(task => task.trainOrFlightNumber && task.trainOrFlightNumber.trim() !== ''));
      console.log('Guest Pickup tasks:', tasks.filter(task => task.type === 'Guest Pickup'));
      console.log('Item Pickup tasks:', tasks.filter(task => task.type === 'Item Pickup'));
      
      const transportTasks = tasks.filter(task => 
        task.trainOrFlightNumber && 
        task.trainOrFlightNumber.trim() !== '' &&
        (task.type === 'Guest Pickup' || task.type === 'Item Pickup')
      );
      
      console.log('Filtered transport tasks:', transportTasks);

      const transportInfoPromises = transportTasks.map(async (task) => {
        const transportType = TransportTrackingService.getTransportType(task.trainOrFlightNumber);
        const transportInfo = await TransportTrackingService.getTransportInfo(
          transportType,
          task.trainOrFlightNumber
        );

        if (transportInfo) {
          return {
            id: task.id || `transport-${task.trainOrFlightNumber}`,
            type: transportType,
            number: task.trainOrFlightNumber,
            name: transportInfo.name,
            origin: transportInfo.origin || 'Unknown',
            destination: transportInfo.destination || task.location,
            scheduledTime: task.time || new Date().toISOString(),
            estimatedTime: task.estimatedEta || task.time || new Date().toISOString(),
            status: transportInfo.status,
            delay: transportInfo.delay || 0,
            platform: transportInfo.platform || transportInfo.gate || 'TBD',
            gate: transportInfo.gate,
            terminal: transportInfo.terminal,
            guestCount: parseInt(task.passengerCount) || 1,
            taskId: task.id || '',
            location: task.location
          } as TransportInfo;
        }

        // If no transport info found, create a basic entry
        return {
          id: task.id || `transport-${task.trainOrFlightNumber}`,
          type: transportType,
          number: task.trainOrFlightNumber,
          name: `${transportType === 'train' ? 'Train' : 'Flight'} ${task.trainOrFlightNumber}`,
          origin: 'Unknown',
          destination: task.location,
          scheduledTime: task.time || new Date().toISOString(),
          estimatedTime: task.estimatedEta || task.time || new Date().toISOString(),
          status: 'On Time' as const,
          delay: 0,
          platform: 'TBD',
          guestCount: parseInt(task.passengerCount) || 1,
          taskId: task.id || '',
          location: task.location
        } as TransportInfo;
      });

      const results = await Promise.all(transportInfoPromises);
      setTransportData(results);
    } catch (err) {
      console.error('Error fetching transport data:', err);
      setError('Failed to fetch transport tracking information');
    } finally {
      setLoading(false);
    }
  };

  // Refresh transport data
  const refreshTransportData = () => {
    fetchTransportData();
  };

  // Auto-refresh every 2 minutes
  useEffect(() => {
    fetchTransportData();
    
    const interval = setInterval(fetchTransportData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Calculate statistics
  const statistics = {
    total: transportData.length,
    onTime: transportData.filter(t => t.status === 'On Time').length,
    delayed: transportData.filter(t => t.status === 'Delayed').length,
    arrived: transportData.filter(t => t.status === 'Arrived').length,
    boarding: transportData.filter(t => t.status === 'Boarding').length,
    totalGuests: transportData.reduce((sum, t) => sum + t.guestCount, 0)
  };

  // Get next arrival
  const nextArrival = transportData
    .filter(t => t.status !== 'Arrived')
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())[0];

  // Get delayed transports
  const delayedTransports = transportData.filter(t => t.status === 'Delayed');

  return {
    transportData,
    loading: loading || tasksLoading,
    error: error || tasksError,
    statistics,
    nextArrival,
    delayedTransports,
    refreshTransportData
  };
};
