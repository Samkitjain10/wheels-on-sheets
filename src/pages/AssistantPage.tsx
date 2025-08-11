import { AiAssistant } from "@/components/AiAssistant";

const AssistantPage = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Assistant
          </h1>
          <p className="text-lg text-muted-foreground">
            Get intelligent insights and recommendations for wedding logistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main AI Assistant */}
          <div className="lg:col-span-2">
            <AiAssistant />
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Quick Questions</h2>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-accent-light rounded border-l-4 border-accent">
                  "Who is free right now?"
                </div>
                <div className="p-2 bg-success-light rounded border-l-4 border-success">
                  "What's the optimal route for today?"
                </div>
                <div className="p-2 bg-warning-light rounded border-l-4 border-warning">
                  "Any traffic issues to watch?"
                </div>
                <div className="p-2 bg-primary-light rounded border-l-4 border-primary text-primary-foreground">
                  "Best driver for VIP pickup?"
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">AI Features</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-1.5"></div>
                  <div>
                    <strong>Smart Assignment:</strong> AI analyzes driver location, capacity, and traffic to suggest optimal task assignments.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-1.5"></div>
                  <div>
                    <strong>Route Optimization:</strong> Real-time traffic analysis for the most efficient pickup routes.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-1.5"></div>
                  <div>
                    <strong>Predictive Alerts:</strong> Early warning system for potential delays or conflicts.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                  <div>
                    <strong>Natural Language:</strong> Ask questions in plain English about your logistics needs.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>n8n Webhook</span>
                  <span className="px-2 py-1 bg-success text-success-foreground rounded text-xs">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ollama API</span>
                  <span className="px-2 py-1 bg-success text-success-foreground rounded text-xs">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Google Sheets</span>
                  <span className="px-2 py-1 bg-success text-success-foreground rounded text-xs">Synced</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maps API</span>
                  <span className="px-2 py-1 bg-success text-success-foreground rounded text-xs">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;