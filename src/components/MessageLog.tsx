import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Clock, User, CheckCircle, AlertCircle } from "lucide-react";

interface WhatsAppMessage {
  id: string;
  timestamp: string;
  driverName: string;
  message: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed';
}

interface MessageLogProps {
  messages: WhatsAppMessage[];
}

export const MessageLog = ({ messages }: MessageLogProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'Read':
        return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'Failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent': return 'bg-muted text-muted-foreground';
      case 'Delivered': return 'bg-success text-success-foreground';
      case 'Read': return 'bg-accent text-accent-foreground';
      case 'Failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          WhatsApp Message Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No messages sent yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Time</TableHead>
                <TableHead className="w-[120px]">Driver</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{message.driverName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={message.message}>
                      {message.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(message.status)} flex items-center gap-1`}
                    >
                      {getStatusIcon(message.status)}
                      {message.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};