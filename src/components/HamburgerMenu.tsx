import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Car, Plus, Clock, Bot, Train, MessageSquare, Home } from "lucide-react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/drivers", label: "Driver Overview", icon: Car },
  { href: "/tasks", label: "Task Manager", icon: Plus },
  { href: "/eta", label: "Live ETA View", icon: Clock },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/arrivals", label: "Train Arrivals", icon: Train },
  { href: "/messages", label: "Message Log", icon: MessageSquare },
];

export const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 shadow-elegant">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">
            <span className="bg-gradient-primary bg-clip-text text-transparent font-bold">
              Wedding Logistics
            </span>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
};