import { useState, useEffect } from 'react';
import { Driver } from '@/lib/googleSheets';
import { GoogleSheetsService } from '@/lib/googleSheets';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoogleSheetsService.fetchDrivers();
      setDrivers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drivers');
      // Fallback to mock data if API fails
      console.warn('Falling back to mock data due to API error');
    } finally {
      setLoading(false);
    }
  };

  const updateDriverStatus = async (driverId: string, status: 'Available' | 'Busy') => {
    try {
      await GoogleSheetsService.updateDriverStatus(driverId, status);
      // Update local state immediately for better UX
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId ? { ...driver, status } : driver
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update driver status');
    }
  };

  const updateDriverLocation = async (driverId: string, location: string) => {
    try {
      await GoogleSheetsService.updateDriverLocation(driverId, location);
      // Update local state immediately
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId ? { ...driver, currentLocation: location } : driver
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update driver location');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    error,
    fetchDrivers,
    updateDriverStatus,
    updateDriverLocation,
  };
};