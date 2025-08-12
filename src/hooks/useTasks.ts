import { useState, useEffect } from 'react';
import { Task } from '@/lib/googleSheets';
import { GoogleSheetsService } from '@/lib/googleSheets';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoogleSheetsService.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.warn('Falling back to mock data due to API error');
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks: refreshTasks,
  };
};
