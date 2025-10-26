import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  CreditCard,
  MapPin,
  Wrench,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const role = localStorage.getItem("role"); // "ADMIN" or "CUSTOMER"

  const adminNavItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vehicles", label: "Vehicles", icon: Car },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/rentals", label: "Rentals", icon: FileText },
    { href: "/payments", label: "Payments", icon: CreditCard },
    { href: "/branches", label: "Branches", icon: MapPin },
    { href: "/staff", label: "Staff", icon: Users },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
  ];

  const customerNavItems = [
    { href: "/customer-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vehicles", label: "Vehicles", icon: Car },
    { href: "/rentals", label: "Rentals", icon: FileText },
    { href: "/payments", label: "Payments", icon: CreditCard },
  ];

  const navItems = role === "CUSTOMER" ? customerNavItems : adminNavItems;

  return (
      <>
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar */}
        <aside
            className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white p-6 transform transition-transform duration-200 ease-in-out z-40 ${
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            }`}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold">VehicleRent</h1>
            <p className="text-sm text-slate-400">Management System</p>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = location === href;
              return (
                  <Link key={href} href={href}>
                    <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start ${
                            isActive
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "text-slate-300 hover:text-white hover:bg-slate-800"
                        }`}
                        onClick={() => setIsOpen(false)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Button>
                  </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
      </>
  );
}
