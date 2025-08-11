import { Link, useLocation } from "react-router-dom";
import { Car, Plus, Clock, Bot, Train, MessageSquare, Home } from "lucide-react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/drivers", label: "Driver Overview", icon: Car },
  { href: "/tasks", label: "Task Manager", icon: Plus },
  { href: "/eta", label: "Live ETA View", icon: Clock },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/arrivals", label: "Train Arrivals", icon: Train },
  { href: "/messages", label: "Message Log", icon: MessageSquare },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg z-40">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Wedding Logistics
          </h1>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-elegant' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}; 