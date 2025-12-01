import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { OfflineProvider } from "./contexts/OfflineContext";

// Pages
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import Home3 from "./pages/Home3";
import LoginScreen from "./pages/LoginScreen";
import RoleBasedDashboard from "./pages/RoleBasedDashboard";
import QRScanDemo from "./pages/QRScanDemo";
import EquipmentSelection from "./pages/EquipmentSelection";
import InspectionForm from "./pages/InspectionForm";
import DefectDocumentation from "./pages/DefectDocumentation";
import SignatureCapture from "./pages/SignatureCapture";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import SiteManagerDashboard from "./pages/SiteManagerDashboard";
import AdminPortal from "./pages/AdminPortal";
import SiteManagement from "./pages/SiteManagement";
import NotificationUI from "./pages/NotificationUI";
import OperatorHistoryView from "./pages/OperatorHistoryView";
import WorkplaceExams from "./pages/WorkplaceExams";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <OfflineProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/option2" element={<Home2 />} />
              <Route path="/option3" element={<Home3 />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/operator-dashboard" element={<RoleBasedDashboard />} />
              <Route path="/qr-demo" element={<QRScanDemo />} />
              <Route path="/maintenance-history" element={<OperatorHistoryView />} />
              <Route path="/workplace-exams" element={<WorkplaceExams />} />
              <Route path="/equipment-selection" element={<EquipmentSelection />} />
              <Route path="/inspection-form" element={<InspectionForm />} />
              <Route path="/defect-documentation" element={<DefectDocumentation />} />
              <Route path="/signature-capture" element={<SignatureCapture />} />
              <Route path="/maintenance-dashboard" element={<MaintenanceDashboard />} />
              <Route path="/site-manager-dashboard" element={<SiteManagerDashboard />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/site-management" element={<SiteManagement />} />
              <Route path="/notifications" element={<NotificationUI />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OfflineProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
