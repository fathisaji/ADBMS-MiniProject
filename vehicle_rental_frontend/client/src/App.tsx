import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Customers from "./pages/Customers";
import Rentals from "./pages/Rentals";
import Payments from "./pages/Payments";
import Branches from "./pages/Branches";
import Staff from "./pages/Staff";
import Maintenance from "./pages/Maintenance";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/vehicles"} component={Vehicles} />
      <Route path={"/customers"} component={Customers} />
      <Route path={"/rentals"} component={Rentals} />
      <Route path={"/payments"} component={Payments} />
      <Route path={"/branches"} component={Branches} />
      <Route path={"/staff"} component={Staff} />
      <Route path={"/maintenance"} component={Maintenance} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8">
              <Router />
            </main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
