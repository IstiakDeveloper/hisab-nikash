import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
  Home,
  BarChart3,
  Wallet,
  PieChart,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Plus
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { auth } = usePage().props as any;
  const [open, setOpen] = useState(false);

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      color: "text-blue-500"
    },
    {
      name: "Accounts",
      href: "/accounts",
      icon: Wallet,
      color: "text-green-500"
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: BarChart3,
      color: "text-red-500"
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: PieChart,
      color: "text-purple-500"
    },
  ];

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center space-x-2">
                  <div className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    FinanceTracker
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="flex-1 overflow-auto p-4">
                <ul className="space-y-2">
                  {routes.map((route) => (
                    <li key={route.href}>
                      <Link
                        href={route.href}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <route.icon className={cn("w-5 h-5 mr-3", route.color)} />
                        <span>{route.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t">
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          FinanceTracker
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.name} />
                <AvatarFallback>{getInitials(auth?.user?.name || "User")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/logout" method="post" as="button" className="flex items-center w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="fixed hidden w-64 h-screen md:flex flex-col bg-white border-r">
          <div className="p-6 border-b">
            <div className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              FinanceTracker
            </div>
          </div>
          <nav className="flex-1 overflow-auto p-4">
            <ul className="space-y-2">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <route.icon className={cn("w-5 h-5 mr-3", route.color)} />
                    <span>{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar>
                <AvatarImage src={auth?.user?.avatar} alt={auth?.user?.name} />
                <AvatarFallback>{getInitials(auth?.user?.name || "User")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{auth?.user?.name}</p>
                <p className="text-sm text-gray-500">{auth?.user?.email}</p>
              </div>
            </div>
            <Link
              href="/logout"
              method="post"
              as="button"
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-500" />
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 min-h-screen">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      <Button
        className="fixed right-4 bottom-4 w-14 h-14 rounded-full shadow-lg md:hidden"
        size="icon"
        style={{
          background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
          color: "white"
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default AdminLayout;
