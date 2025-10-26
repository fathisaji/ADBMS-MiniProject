import { useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import Customers from "@/pages/Customers";
import Rentals from "@/pages/Rentals";
import Payments from "@/pages/Payments";
import Branches from "@/pages/Branches";
import Staff from "@/pages/Staff";
import Maintenance from "@/pages/Maintenance";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CustomerDashboard from "@/pages/CustomerDashboard.tsx";
import CustomerVehicles from "@/pages/CustomerVehicles.tsx";

function ProtectedRoute({ component: Component }: { component: React.FC }) {
  const [, setLocation] = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLocation("/login");
    }
  }, [token, setLocation]);

  return token ? <Component /> : null;
}

function Router() {
  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* Protected routes */}
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/vehicles" component={() => <ProtectedRoute component={Vehicles} />} />
      <Route path="/customers" component={() => <ProtectedRoute component={Customers} />} />
      <Route path="/rentals" component={() => <ProtectedRoute component={Rentals} />} />
      <Route path="/payments" component={() => <ProtectedRoute component={Payments} />} />
      <Route path="/branches" component={() => <ProtectedRoute component={Branches} />} />
      <Route path="/staff" component={() => <ProtectedRoute component={Staff} />} />
      <Route path="/maintenance" component={() => <ProtectedRoute component={Maintenance} />} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/customer-dashboard" component={CustomerDashboard} />
        <Route path="/customer-vehicles" component={CustomerVehicles} />



      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAuthPage = location === "/login" || location === "/signup";

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex min-h-screen">
            {/* Show Sidebar only if logged in */}
            {!isAuthPage && <Sidebar />}
            <main className={`flex-1 ${!isAuthPage ? "md:ml-64 p-4 md:p-8" : "flex items-center justify-center"}`}>
              <Router />
            </main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
