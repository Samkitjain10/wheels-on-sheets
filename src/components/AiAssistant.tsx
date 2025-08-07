import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export const AiAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I can help you with wedding logistics. Ask me things like "Who is free now?" or "What\'s the best way to assign today\'s tasks?"',
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in real app, this would call n8n webhook -> Ollama)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAiResponse(input),
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);

    toast({
      title: "Question Sent",
      description: "Sending your query to AI assistant via n8n...",
    });
  };

  const getAiResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('free') || lowerQuery.includes('available')) {
      return 'Currently available drivers: Ramesh (4-seater), Priya (7-seater). Both are at the venue and ready for assignments.';
    }
    
    if (lowerQuery.includes('assign') || lowerQuery.includes('task')) {
      return 'Based on current locations and capacity, I recommend: 1) Assign Ramesh to pickup from Banton (closer to his location), 2) Priya can handle the Bhilwara route with multiple guests.';
    }
    
    if (lowerQuery.includes('ramesh') && lowerQuery.includes('bhilwara')) {
      return 'Yes, Ramesh can pick up from Banton at 3:30 PM and still reach Bhilwara by 5:00 PM. Travel time is 1.5 hours with current traffic conditions.';
    }
    
    return 'I understand your query. Let me analyze the current logistics situation and driver availability to provide the best recommendation.';
  };

  const quickQuestions = [
    "Who is free now?",
    "Best way to assign today's tasks?",
    "Can Ramesh handle Bhilwara pickup?",
    "Show traffic alerts"
  ];

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64 w-full border border-border rounded-md p-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">Quick questions:</div>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button 
                key={index}
                variant="outline" 
                size="sm"
                className="text-xs h-8"
                onClick={() => setInput(question)}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                {question}
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about logistics, drivers, or tasks..."
            disabled={isLoading}
          />
          <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};