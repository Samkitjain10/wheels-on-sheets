import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Bot, User } from "lucide-react";

interface TaskFormData {
  type: 'Guest Pickup' | 'Item Pickup' | '';
  location: string;
  time: string;
  guestCount?: number;
  itemDescription?: string;
  assignTo?: string;
}

interface TaskFormProps {
  drivers: Array<{ id: string; name: string; status: string }>;
  onTaskCreate: (task: TaskFormData) => void;
}

export const TaskForm = ({ drivers, onTaskCreate }: TaskFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TaskFormData>({
    type: '',
    location: '',
    time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.location || !formData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onTaskCreate(formData);
    setFormData({
      type: '',
      location: '',
      time: '',
    });
    
    toast({
      title: "Task Created",
      description: "New task has been added successfully",
    });
  };

  const handleAiAssign = () => {
    toast({
      title: "AI Assignment Triggered",
      description: "Sending task to AI agent via n8n for optimal assignment",
    });
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Task Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'Guest Pickup' | 'Item Pickup' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Guest Pickup">Guest Pickup</SelectItem>
                  <SelectItem value="Item Pickup">Item Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Scheduled Time</Label>
              <Input
                id="time"
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter pickup/delivery location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {formData.type === 'Guest Pickup' && (
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
          )}

          {formData.type === 'Item Pickup' && (
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Item Description</Label>
              <Textarea
                id="itemDescription"
                placeholder="Describe the items to be picked up"
                value={formData.itemDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, itemDescription: e.target.value }))}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assignTo">Assign to Driver (Optional)</Label>
            <Select 
              value={formData.assignTo || 'auto-assign'} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignTo: value === 'auto-assign' ? undefined : value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Auto-assign or select driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto-assign">Auto-assign</SelectItem>
                {drivers.filter(d => d.status === 'Available').map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              <User className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAiAssign}
              className="flex-1"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assign
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};