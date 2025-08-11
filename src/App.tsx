import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Index from "./pages/Index";
import DriversPage from "./pages/DriversPage";
import TasksPage from "./pages/TasksPage";
import EtaPage from "./pages/EtaPage";
import AssistantPage from "./pages/AssistantPage";
import ArrivalsPage from "./pages/ArrivalsPage";
import MessagesPage from "./pages/MessagesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Sidebar />
        <div className="ml-72">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/eta" element={<EtaPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/arrivals" element={<ArrivalsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
