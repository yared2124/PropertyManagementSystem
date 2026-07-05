import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/common/Layout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyForm from "./pages/PropertyForm";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import ContractForm from "./pages/ContractForm";
import Payments from "./pages/Payments";
import Vehicles from "./pages/Vehicles";
import VehicleForm from "./pages/VehicleForm";
import Maintenance from "./pages/Maintenance";
import Inspections from "./pages/Inspections";
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/new" element={<PropertyForm />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/properties/:id/edit" element={<PropertyForm />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/new" element={<VehicleForm />} />
              <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
              <Route path="/contracts" element={<Contracts />} />
              <Route path="/contracts/new" element={<ContractForm />} />
              <Route path="/contracts/:id" element={<ContractDetail />} />
              <Route path="/contracts/:id/edit" element={<ContractForm />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/poa" element={<POA />} />
              <Route path="/poa/new" element={<POAForm />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/salaries" element={<Salaries />} />
              <Route path="/attendances" element={<Attendances />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<Users />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/sales" element={<Sales />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
