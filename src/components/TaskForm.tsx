import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, User, MapPin, Search } from "lucide-react";
import { GoogleSheetsService } from "@/lib/googleSheets";
import { SerpService } from "@/lib/serp";
import { LocationSuggestion } from "@/lib/locations";

interface TaskFormData {
  type: 'Guest Pickup' | 'Item Pickup' | '';
  // Guest Pickup fields
  guestName?: string;
  guestContact?: string;
  guestCount?: number;
  trainOrFlightNumber?: string;
  // Item Pickup fields
  itemName?: string;
  itemPickupDeadline?: string;
  // Common fields
  location: string;
  scheduledTime?: string;
  notes?: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface TaskFormProps {
  onTaskCreate: (task: TaskFormData) => void;
}

export const TaskForm = ({ onTaskCreate }: TaskFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TaskFormData>({
    type: '',
    location: '',
    priority: 'Medium',
  });
  
  // Location search state (SerpAPI)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Cache helpers (sessionStorage)
  const getCacheKey = (q: string) => `serpapi:IN:rajasthan:bhilwara:${q.trim().toLowerCase()}`;
  const readFromCache = (q: string): LocationSuggestion[] | null => {
    try {
      const raw = sessionStorage.getItem(getCacheKey(q));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return null;
      return parsed as LocationSuggestion[];
    } catch {
      return null;
    }
  };
  const writeToCache = (q: string, data: LocationSuggestion[]) => {
    try {
      if (Array.isArray(data) && data.length > 0) {
        sessionStorage.setItem(getCacheKey(q), JSON.stringify(data));
      }
    } catch {
      // ignore
    }
  };

  // While typing, only update state; do not hit the API
  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
    if (value.length < 3) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  // Explicit search trigger (button/Enter)
  const runLocationSearch = async () => {
    let value = formData.location.trim();
    if (value.length < 3) return;

    // Handle "near me" queries by appending Bhilwara context and using a fixed center
    const isNearMe = /\bnear me\b/i.test(value);
    const cleaned = value.replace(/\bnear me\b/gi, '').trim();
    const finalQuery = isNearMe ? `${cleaned} Bhilwara Rajasthan` : value;

    const cached = readFromCache(finalQuery);
    if (cached) {
      setLocationSuggestions(cached);
      setShowLocationSuggestions(cached.length > 0);
      return;
    }

    setIsSearching(true);
    try {
      const suggestions = await SerpService.searchLocations(finalQuery, 'IN', {
        regionName: 'Rajasthan',
        nearCenter: { lat: 25.340739, lng: 74.631318 }, // Bhilwara center
      });
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(suggestions.length > 0);
      writeToCache(finalQuery, suggestions);
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const selectLocation = (feature: LocationSuggestion) => {
    setFormData(prev => ({ ...prev, location: feature.place_name }));
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.location-search-container')) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate Guest Pickup specific fields
    if (formData.type === 'Guest Pickup') {
      if (!formData.guestName || !formData.guestContact || !formData.guestCount || !formData.scheduledTime) {
        toast({
          title: "Missing Guest Information",
          description: "Please fill in guest name, contact, count, and scheduled time",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate Item Pickup specific fields
    if (formData.type === 'Item Pickup') {
      if (!formData.itemName || !formData.itemPickupDeadline) {
        toast({
          title: "Missing Item Information",
          description: "Please fill in item name and pickup deadline",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // Format data for Google Sheets
      const taskDataForSheets = {
        type: formData.type,
        itemName: formData.itemName || '',
        itemPickupDeadline: formData.itemPickupDeadline || '',
        passengerName: formData.guestName || '',
        passengerNumber: formData.guestContact || '',
        passengerCount: formData.guestCount || '',
        modeOfTransport: formData.type === 'Guest Pickup' ? 'Train/Flight' : '',
        trainOrFlightNumber: formData.trainOrFlightNumber || '',
        location: formData.location,
        date: formData.scheduledTime ? new Date(formData.scheduledTime).toLocaleDateString() : '',
        time: formData.scheduledTime ? new Date(formData.scheduledTime).toLocaleTimeString() : '',
        assignedDriver: 'Auto-assign',
        status: 'Pending',
        priority: formData.type === 'Guest Pickup' ? 'High' : formData.priority, // High priority for Guest Pickup
        estimatedEta: '',
        notes: formData.notes || ''
      };

      // Save to Google Sheets
      await GoogleSheetsService.createTask(taskDataForSheets);
      
      // Call the parent callback
      onTaskCreate(formData);
      
      // Reset form
      setFormData({
        type: '',
        location: '',
        priority: 'Medium',
      });
      
      toast({
        title: "Task Created",
        description: "New task has been added to Google Sheets successfully",
      });
    } catch (error) {
      toast({
        title: "Error Creating Task",
        description: "Failed to save task to Google Sheets. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating task:', error);
    }
  };



  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Task Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formData.type === 'Guest Pickup' ? 'default' : 'outline'}
                className="h-12"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Guest Pickup', priority: 'High' }))}
              >
                <User className="w-4 h-4 mr-2" />
                Guest Pickup
              </Button>
              <Button
                type="button"
                variant={formData.type === 'Item Pickup' ? 'default' : 'outline'}
                className="h-12"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Item Pickup' }))}
              >
                <Plus className="w-4 h-4 mr-2" />
                Item Pickup
              </Button>
            </div>
            {formData.type === 'Guest Pickup' && (
              <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
                <span className="font-medium">Note:</span> Guest Pickup tasks are automatically set to High Priority
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative location-search-container">
              <Input
                id="location"
                placeholder="Search for pickup/delivery location"
                value={formData.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runLocationSearch();
                  }
                }}
                className="pr-14"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={runLocationSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-50 px-2 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 pointer-events-auto focus:outline-none focus:ring-0"
                aria-label="Search locations"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                ) : (
                  <Search className="w-4 h-4 text-gray-700" />
                )}
              </button>
              
              {/* Location Suggestions */}
              {showLocationSuggestions && (
                <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {locationSuggestions.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => selectLocation(feature)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-sm">{feature.text}</div>
                          <div className="text-xs text-gray-500">{feature.place_name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {locationSuggestions.length === 0 && formData.location.length > 2 && !isSearching && (
                    <div className="px-4 py-2 text-gray-500 text-sm">No locations found</div>
                  )}
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              💡 Tip: Type full query (e.g., "Surya Mahal Bhilwara Rajasthan") and press Enter or click the search button.
            </div>
          </div>

          {formData.type === 'Guest Pickup' && (
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                <span className="text-green-800 font-medium">High Priority (Auto-set for Guest Pickup)</span>
              </div>
            </div>
          )}

          {formData.type === 'Item Pickup' && (
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as 'Low' | 'Medium' | 'High' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.type === 'Guest Pickup' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Guest Name</Label>
                  <Input
                    id="guestName"
                    placeholder="Enter guest name"
                    value={formData.guestName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestContact">Guest Contact</Label>
                  <Input
                    id="guestContact"
                    placeholder="Enter contact number"
                    value={formData.guestContact || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestContact: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    placeholder="Enter guest count"
                    value={formData.guestCount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value) || undefined }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainOrFlightNumber">Train/Flight Number</Label>
                  <Input
                    id="trainOrFlightNumber"
                    placeholder="Enter train or flight number"
                    value={formData.trainOrFlightNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainOrFlightNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={formData.scheduledTime || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
            </>
          )}

          {formData.type === 'Item Pickup' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    placeholder="Enter item name"
                    value={formData.itemName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemPickupDeadline">Pickup Deadline</Label>
                  <Input
                    id="itemPickupDeadline"
                    type="datetime-local"
                    value={formData.itemPickupDeadline || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemPickupDeadline: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>



          <div className="pt-2">
            <Button type="submit" className="w-full">
              <User className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};