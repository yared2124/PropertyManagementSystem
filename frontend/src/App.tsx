import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/common/Layout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// ----- Public Pages -----
import Home from "./pages/Home"; // ✅ ADD THIS
import Login from "./pages/Login";
import Register from "./pages/Register";

// ----- Protected Pages -----
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyForm from "./pages/PropertyForm";
import Vehicles from "./pages/Vehicles";
import VehicleForm from "./pages/VehicleForm";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import ContractForm from "./pages/ContractForm";
import Payments from "./pages/Payments";
import Maintenance from "./pages/Maintenance";
import MaintenanceForm from "./pages/MaintenanceForm";
import Inspections from "./pages/Inspections";
import InspectionForm from "./pages/InspectionForm";
import POA from "./pages/POA";
import POAForm from "./pages/POAForm";
import Employees from "./pages/Employees";
import Salaries from "./pages/Salaries";
import Attendances from "./pages/Attendances";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Calendar from "./pages/Calendar";
import Skills from "./pages/Skills";
import Sales from "./pages/Sales";
import Lands from "./pages/Lands";
import Rentals from "./pages/Rentals";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AuditLogs from "./pages/AuditLogs";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<Home />} /> {/* ✅ ADD THIS LINE */}
          <Route path="/home" element={<Home />} /> {/* Optional alias */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* ========== PROTECTED ROUTES ========== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* ----- Accessible by all authenticated users ----- */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/calendar" element={<Calendar />} />

              {/* ----- Tenants & Landlords (own data) ----- */}
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contracts/:id" element={<ContractDetail />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/maintenance" element={<Maintenance />} />

              {/* ----- Property Managers & Admins ----- */}
              <Route
                path="/properties"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <Properties />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties/new"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <PropertyForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties/:id"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <PropertyDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/properties/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <PropertyForm />
                  </ProtectedRoute>
                }
              />

              {/* ----- Vehicles (Manager/Admin) ----- */}
              <Route
                path="/vehicles"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <Vehicles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicles/new"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <VehicleForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicles/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <VehicleForm />
                  </ProtectedRoute>
                }
              />

              {/* ----- Contracts (create/edit – Manager/Admin) ----- */}
              <Route
                path="/contracts/new"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <ContractForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <ContractForm />
                  </ProtectedRoute>
                }
              />

              {/* ----- Rentals ----- */}
              <Route
                path="/rentals"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <Rentals />
                  </ProtectedRoute>
                }
              />

              {/* ----- Maintenance (create – any user, but full management only for Manager/Admin) ----- */}
              <Route
                path="/maintenance/new"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <MaintenanceForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <MaintenanceForm />
                  </ProtectedRoute>
                }
              />

              {/* ----- Inspections (Manager/Admin) ----- */}
              <Route
                path="/inspections"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <Inspections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inspections/new"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <InspectionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inspections/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <InspectionForm />
                  </ProtectedRoute>
                }
              />

              {/* ----- Power of Attorney (Legal Admin, Manager, Admin) ----- */}
              <Route
                path="/poa"
                element={
                  <ProtectedRoute
                    requiredRole={[
                      "SYSTEM_ADMIN",
                      "PROPERTY_MANAGER",
                      "LEGAL_ADMIN",
                    ]}
                  >
                    <POA />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/poa/new"
                element={
                  <ProtectedRoute
                    requiredRole={[
                      "SYSTEM_ADMIN",
                      "PROPERTY_MANAGER",
                      "LEGAL_ADMIN",
                    ]}
                  >
                    <POAForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/poa/:id/edit"
                element={
                  <ProtectedRoute
                    requiredRole={[
                      "SYSTEM_ADMIN",
                      "PROPERTY_MANAGER",
                      "LEGAL_ADMIN",
                    ]}
                  >
                    <POAForm />
                  </ProtectedRoute>
                }
              />

              {/* ----- Employees & HR (Admin only) ----- */}
              <Route
                path="/employees"
                element={
                  <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                    <Employees />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/salaries"
                element={
                  <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                    <Salaries />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendances"
                element={
                  <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                    <Attendances />
                  </ProtectedRoute>
                }
              />

              {/* ----- User Management (Admin only) ----- */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                    <Users />
                  </ProtectedRoute>
                }
              />

              {/* ----- Audit Logs (Admin only) ----- */}
              <Route
                path="/audit-logs"
                element={
                  <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />

              {/* ----- Reports (Admin & Accountant) ----- */}
              <Route
                path="/sales"
                element={
                  <ProtectedRoute requiredRole={["SYSTEM_ADMIN", "ACCOUNTANT"]}>
                    <Sales />
                  </ProtectedRoute>
                }
              />

              {/* ----- Lands (Manager/Admin) ----- */}
              <Route
                path="/lands"
                element={
                  <ProtectedRoute
                    requiredRole={["SYSTEM_ADMIN", "PROPERTY_MANAGER"]}
                  >
                    <Lands />
                  </ProtectedRoute>
                }
              />

              {/* ----- Skills (Admin only) ----- */}
              <Route
                path="/skills"
                element={
                  <ProtectedRoute requiredRole="SYSTEM_ADMIN">
                    <Skills />
                  </ProtectedRoute>
                }
              />

              {/* ----- Catch-all 404 ----- */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    Page not found
                  </div>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
