import { TrainArrivals } from "@/components/TrainArrivals";
import { useTransportTracking } from "@/hooks/useTransportTracking";
import { TransportTrackingService } from "@/lib/transportTracking";
import { Train, Plane, Clock, MapPin, Users, AlertTriangle, CheckCircle } from "lucide-react";

const ArrivalsPage = () => {
  const { 
    transportData, 
    loading, 
    error, 
    statistics, 
    nextArrival, 
    delayedTransports,
    refreshTransportData 
  } = useTransportTracking();

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Transport Arrivals
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time tracking of trains and flights from Tasks Table
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-success">{statistics.onTime}</div>
            <div className="text-sm text-muted-foreground">On Time</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-warning">{statistics.delayed}</div>
            <div className="text-sm text-muted-foreground">Delayed</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-accent">{statistics.arrived}</div>
            <div className="text-sm text-muted-foreground">Arrived</div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-primary">{statistics.totalGuests}</div>
            <div className="text-sm text-muted-foreground">Total Guests</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transport Arrivals */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-card rounded-lg p-6 shadow-card text-center">
                <div className="text-lg font-semibold mb-2">Loading transport arrivals...</div>
                <div className="text-muted-foreground">Fetching real-time data from Tasks Table</div>
              </div>
            ) : error ? (
              <div className="bg-card rounded-lg p-6 shadow-card text-center">
                <div className="text-lg font-semibold mb-2 text-red-500">Error loading arrivals</div>
                <div className="text-muted-foreground">{error}</div>
              </div>
            ) : (
              <TrainArrivals 
                arrivals={transportData} 
                onRefresh={refreshTransportData}
                loading={loading}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pickup Coordination */}
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Pickup Coordination</h2>
              <div className="space-y-4">
                {nextArrival ? (
                  <div className="bg-success-light p-3 rounded-lg">
                    <h3 className="font-medium text-success-foreground">Next Pickup</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {nextArrival.number} - {nextArrival.guestCount} guests
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {nextArrival.type === 'train' ? 'Station' : 'Airport'}: {nextArrival.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ETA: {TransportTrackingService.calculateETA(nextArrival.scheduledTime, nextArrival.delay)}
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">No upcoming pickups</p>
                  </div>
                )}
                
                {delayedTransports.length > 0 ? (
                  <div className="bg-warning-light p-3 rounded-lg">
                    <h3 className="font-medium text-warning-foreground">Delayed Transports</h3>
                    {delayedTransports.slice(0, 2).map((transport) => (
                      <div key={transport.id} className="mt-2 p-2 bg-warning/20 rounded">
                        <p className="text-sm text-muted-foreground">
                          {transport.number} delayed by {transport.delay} minutes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Notify assigned driver
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-success-light p-3 rounded-lg">
                    <h3 className="font-medium text-success-foreground">All On Time</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      No delays reported
                    </p>
                  </div>
                )}

                {statistics.arrived > 0 && (
                  <div className="bg-accent-light p-3 rounded-lg">
                    <h3 className="font-medium text-accent-foreground">Recently Arrived</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {statistics.arrived} transport(s) arrived
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Coordinate immediate pickups
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Data Source */}
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Data Source</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${transportData.length > 0 ? 'bg-success' : 'bg-warning'}`}></div>
                  <span>Tasks Table sync: {transportData.length > 0 ? 'Active' : 'No data'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${!error ? 'bg-success' : 'bg-destructive'}`}></div>
                  <span>Transport tracking: {!error ? 'Connected' : 'Error'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Google Sheets integration active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Auto-refresh: Every 2 minutes</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total transports: {statistics.total} | Guests: {statistics.totalGuests}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrivalsPage;