// src/routes/index.tsx

/**
 * Simple route configuration
 * Defines all application routes with their components and metadata
 */

import { Navigate } from "react-router-dom";

// Import all pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Properties from "../pages/Properties";
import PropertyDetail from "../pages/PropertyDetail";
import PropertyForm from "../pages/PropertyForm";
import Vehicles from "../pages/Vehicles";
import VehicleForm from "../pages/VehicleForm";
import Contracts from "../pages/Contracts";
import ContractDetail from "../pages/ContractDetail";
import ContractForm from "../pages/ContractForm";
import Payments from "../pages/Payments";
import Maintenance from "../pages/Maintenance";
import MaintenanceForm from "../pages/MaintenanceForm";
import Inspections from "../pages/Inspections";
import InspectionForm from "../pages/InspectionForm";
import POA from "../pages/POA";
import POAForm from "../pages/POAForm";
import Employees from "../pages/Employees";
import Salaries from "../pages/Salaries";
import Attendances from "../pages/Attendances";
import Chat from "../pages/Chat";
import Notifications from "../pages/Notifications";
import Users from "../pages/Users";
import Calendar from "../pages/Calendar";
import Skills from "../pages/Skills";
import Sales from "../pages/Sales";
import Lands from "../pages/Lands";
import Rentals from "../pages/Rentals";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

// ============================================
// Route Definitions
// ============================================
export const routes = {
  // Public routes
  public: [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ],

  // Protected routes (shown inside Layout)
  protected: [
    // Dashboard
    { path: "/", element: <Navigate to="/dashboard" replace /> },
    { path: "/dashboard", element: <Dashboard /> },

    // Properties
    { path: "/properties", element: <Properties /> },
    { path: "/properties/new", element: <PropertyForm /> },
    { path: "/properties/:id", element: <PropertyDetail /> },
    { path: "/properties/:id/edit", element: <PropertyForm /> },

    // Lands
    { path: "/lands", element: <Lands /> },

    // Vehicles
    { path: "/vehicles", element: <Vehicles /> },
    { path: "/vehicles/new", element: <VehicleForm /> },
    { path: "/vehicles/:id/edit", element: <VehicleForm /> },

    // Contracts
    { path: "/contracts", element: <Contracts /> },
    { path: "/contracts/new", element: <ContractForm /> },
    { path: "/contracts/:id", element: <ContractDetail /> },
    { path: "/contracts/:id/edit", element: <ContractForm /> },

    // Rentals
    { path: "/rentals", element: <Rentals /> },

    // Payments
    { path: "/payments", element: <Payments /> },

    // Maintenance
    { path: "/maintenance", element: <Maintenance /> },
    { path: "/maintenance/new", element: <MaintenanceForm /> },
    { path: "/maintenance/:id/edit", element: <MaintenanceForm /> },

    // Inspections
    { path: "/inspections", element: <Inspections /> },
    { path: "/inspections/new", element: <InspectionForm /> },
    { path: "/inspections/:id/edit", element: <InspectionForm /> },

    // Power of Attorney
    { path: "/poa", element: <POA /> },
    { path: "/poa/new", element: <POAForm /> },
    { path: "/poa/:id/edit", element: <POAForm /> },

    // Employees & HR
    { path: "/employees", element: <Employees /> },
    { path: "/salaries", element: <Salaries /> },
    { path: "/attendances", element: <Attendances /> },

    // Communication
    { path: "/chat", element: <Chat /> },
    { path: "/notifications", element: <Notifications /> },

    // Admin
    { path: "/users", element: <Users /> },

    // Other
    { path: "/calendar", element: <Calendar /> },
    { path: "/skills", element: <Skills /> },
    { path: "/sales", element: <Sales /> },

    // Profile & Settings
    { path: "/profile", element: <Profile /> },
    { path: "/settings", element: <Settings /> },

    // 404 - Catch all
    {
      path: "*",
      element: (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Page not found
        </div>
      ),
    },
  ],
};

// ============================================
// Helper exports
// ============================================
export const publicRoutes = routes.public;
export const protectedRoutes = routes.protected;
