// Google Sheets API configuration
const SHEET_ID = '1sV1am40DQy5qsCveQg6p1Zuj3_SklaTuyZ9vwxao96w'; // Your actual sheet ID
const DRIVERS_SHEET = 'Drivers Table'; // Your drivers sheet name
const TASKS_SHEET = 'Tasks Table'; // Your tasks sheet name
const DRIVERS_RANGE = `${DRIVERS_SHEET}!A:I`; // Will be encoded automatically
const API_KEY = 'AIzaSyADgAJTooAZsE0izGwQZmO8MCA4gRknFes'; // You'll need to get this from Google Cloud Console

// Google Apps Script URL for writing tasks
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbM7u1NgOJA5gEnWY1ndgxyYf_WeDDlS5DBzD1dQU49u0XBA52Ips3HvakOqHs3Ivt/exec';

// Base URL for Google Sheets API
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface Driver {
  id: string;
  name: string;
  status: 'Available' | 'Busy';
  carCapacity: number;
  currentTasks: number;
  currentLocation?: string;
  estimatedReturn?: string;
  phoneNumber?: string;
  vehicleNumber?: string;
  email?: string;
  lastUpdated?: string;
}

export interface Task {
  id: string;
  type: string;
  itemName: string;
  itemPickupDeadline: string;
  passengerName: string;
  passengerNumber: string;
  passengerCount: string;
  modeOfTransport: string;
  trainOrFlightNumber: string;
  location: string;
  date: string;
  time: string;
  assignedDriver: string;
  status: string;
  priority: string;
  estimatedEta: string;
  notes: string;
  createdAt: string;
}

export class GoogleSheetsService {
  static async fetchDrivers(): Promise<Driver[]> {
    try {
      const url = `${BASE_URL}/${SHEET_ID}/values/${encodeURIComponent(DRIVERS_RANGE)}?key=${API_KEY}`;
      console.log('Fetching drivers from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Sheets API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Google Sheets API Response:', data);
      
      const rows = data.values;
      
      if (!rows || rows.length === 0) {
        console.log('No data found in sheet');
        return [];
      }

      // Skip header row and map data
      const drivers: Driver[] = rows.slice(1).map((row: any[], index: number) => {
        // Debug logging
        console.log(`Row ${index + 1}:`, row);
        console.log(`Row[4] (Is Available): "${row[4]}"`);
        console.log(`Status will be: ${row[4] === 'Available' ? 'Available' : 'Busy'}`);
        
        return {
          id: row[0] || `driver-${index + 1}`,
          name: row[1] || 'Unknown Driver',
          phoneNumber: row[2] || undefined,
          carCapacity: parseInt(row[3]) || 4,
          status: row[4] === 'Available' ? 'Available' : 'Busy',
          currentLocation: row[5] || 'Wedding Venue',
          currentTasks: parseInt(row[6]) || 0,
          estimatedReturn: row[7] || undefined,
          vehicleNumber: row[8] || undefined,
          lastUpdated: new Date().toISOString(),
        };
      });

      return drivers;
    } catch (error) {
      console.error('Error fetching drivers from Google Sheets:', error);
      
      // Return fallback mock data if API fails
      console.log('Falling back to mock driver data');
      return [
        {
          id: 'DR001',
          name: 'Ram',
          phoneNumber: '9413246555',
          carCapacity: 7,
          status: 'Available',
          currentLocation: 'Bhilwara',
          currentTasks: 0,
          estimatedReturn: undefined,
          vehicleNumber: 'RJ 06 CC 0688',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'DR002',
          name: 'Laxman',
          phoneNumber: '9413246554',
          carCapacity: 4,
          status: 'Available',
          currentLocation: 'Bhilwara',
          currentTasks: 0,
          estimatedReturn: undefined,
          vehicleNumber: 'RJ 06 CB 9999',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'DR003',
          name: 'Shyam',
          phoneNumber: '9413246553',
          carCapacity: 6,
          status: 'Available',
          currentLocation: 'Bhilwara',
          currentTasks: 0,
          estimatedReturn: undefined,
          vehicleNumber: 'RJ 06 CC 1234',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'DR004',
          name: 'Sundar',
          phoneNumber: '9413246552',
          carCapacity: 7,
          status: 'Available',
          currentLocation: 'Bhilwara',
          currentTasks: 0,
          estimatedReturn: undefined,
          vehicleNumber: 'RJ 06 CA 0201',
          lastUpdated: new Date().toISOString(),
        }
      ];
    }
  }

  static async fetchTasks(): Promise<Task[]> {
    try {
      const url = `${BASE_URL}/${SHEET_ID}/values/${encodeURIComponent(TASKS_SHEET)}!A:Q?key=${API_KEY}`;
      console.log('Fetching tasks from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Sheets API Error Response for Tasks:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Google Sheets API Response for Tasks:', data);
      
      const rows = data.values;
      
      if (!rows || rows.length === 0) {
        console.log('No tasks found in sheet');
        return [];
      }

      // Skip header row and map data
      const tasks: Task[] = rows.slice(1).map((row: any[], index: number) => {
        // Enhanced logging to debug your data
        console.log(`Task Row ${index + 1}:`, {
          type: row[0] || 'EMPTY',
          itemName: row[1] || 'EMPTY',
          passengerName: row[3] || 'EMPTY',
          passengerCount: row[5] || 'EMPTY',
          trainOrFlightNumber: row[7] || 'EMPTY',
          location: row[8] || 'EMPTY',
          time: row[10] || 'EMPTY',
          status: row[12] || 'EMPTY'
        });
        
        return {
          id: `task-${index + 1}`,
          type: row[0] || '',
          itemName: row[1] || '',
          itemPickupDeadline: row[2] || '',
          passengerName: row[3] || '',
          passengerNumber: row[4] || '',
          passengerCount: row[5] || '',
          modeOfTransport: row[6] || '',
          trainOrFlightNumber: row[7] || '',
          location: row[8] || '',
          date: row[9] || '',
          time: row[10] || '',
          assignedDriver: row[11] || '',
          status: row[12] || '',
          priority: row[13] || '',
          estimatedEta: row[14] || '',
          notes: row[15] || '',
          createdAt: new Date().toISOString(),
        };
      });

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks from Google Sheets:', error);
      
      // Return fallback mock data if API fails
      console.log('Falling back to mock task data');
      return [
        {
          id: 'task-1',
          type: 'Item Pickup',
          itemName: 'Bonton Drycleaners',
          itemPickupDeadline: '',
          passengerName: '',
          passengerNumber: '',
          passengerCount: '',
          modeOfTransport: '',
          trainOrFlightNumber: '',
          location: 'Bonton Drycleaners',
          date: 'Invalid Date',
          time: '',
          assignedDriver: 'Auto-assign',
          status: 'Pending',
          priority: 'Medium',
          estimatedEta: '',
          notes: '',
          createdAt: new Date().toISOString(),
        }
      ];
    }
  }

  static async updateDriverStatus(driverId: string, status: 'Available' | 'Busy'): Promise<void> {
    try {
      // Find the row number for the driver
      const drivers = await this.fetchDrivers();
      const driverIndex = drivers.findIndex(d => d.id === driverId);
      
      if (driverIndex === -1) {
        throw new Error('Driver not found');
      }

      // Note: For read-only access, we can't update the sheet
      // This would require additional authentication setup
      console.log(`Would update driver ${driverId} status to ${status}`);
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw new Error('Failed to update driver status');
    }
  }

  static async updateDriverLocation(driverId: string, location: string): Promise<void> {
    try {
      const drivers = await this.fetchDrivers();
      const driverIndex = drivers.findIndex(d => d.id === driverId);
      
      if (driverIndex === -1) {
        throw new Error('Driver not found');
      }

      // Note: For read-only access, we can't update the sheet
      // This would require additional authentication setup
      console.log(`Would update driver ${driverId} location to ${location}`);
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw new Error('Failed to update driver location');
    }
  }

  static async createTask(taskData: any): Promise<void> {
    try {
      // Create the task data object for the Apps Script
      const taskDataForScript = {
        type: taskData.type,
        itemName: taskData.itemName || '',
        itemPickupDeadline: taskData.itemPickupDeadline || '',
        passengerName: taskData.passengerName || '',
        passengerNumber: taskData.passengerNumber || '',
        passengerCount: taskData.passengerCount || '',
        modeOfTransport: taskData.modeOfTransport || '',
        trainOrFlightNumber: taskData.trainOrFlightNumber || '',
        location: taskData.location,
        date: taskData.date || '',
        time: taskData.time || '',
        assignedDriver: taskData.assignedDriver || 'Auto-assign',
        status: taskData.status || 'Pending',
        priority: taskData.priority || 'Medium',
        estimatedEta: taskData.estimatedEta || '',
        notes: taskData.notes || ''
      };

      // Convert data to URL parameters
      const params = new URLSearchParams();
      Object.entries(taskDataForScript).forEach(([key, value]) => {
        params.append(key, value);
      });

      // Use JSONP approach to bypass CORS
      const url = `${APPS_SCRIPT_URL}?${params.toString()}&callback=taskCallback`;
      
      return new Promise((resolve, reject) => {
        // Create a unique callback name
        const callbackName = 'taskCallback_' + Date.now();
        
        // Create global callback function
        (window as any)[callbackName] = (result: any) => {
          // Clean up
          delete (window as any)[callbackName];
          document.head.removeChild(script);
          
          if (result.success) {
            console.log('Task successfully created in Google Sheets:', taskData);
            resolve();
          } else {
            reject(new Error(result.error || 'Failed to create task'));
          }
        };

        // Create script tag to make the request
        const script = document.createElement('script');
        script.src = `${APPS_SCRIPT_URL}?${params.toString()}&callback=${callbackName}`;
        script.onerror = () => {
          delete (window as any)[callbackName];
          document.head.removeChild(script);
          reject(new Error('Failed to load script'));
        };
        
        // Add script to page
        document.head.appendChild(script);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if ((window as any)[callbackName]) {
            delete (window as any)[callbackName];
            document.head.removeChild(script);
            reject(new Error('Request timeout'));
          }
        }, 10000);
      });

    } catch (error) {
      console.error('Error creating task in Google Sheets:', error);
      throw new Error('Failed to create task in Google Sheets');
    }
  }
}
