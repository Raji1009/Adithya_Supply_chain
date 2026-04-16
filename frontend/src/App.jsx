import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { AboutPage, ContactPage, HomePage, ServicesPage } from './pages/PublicPages';
import ProducerRequestPage from './pages/ProducerRequestPage';
import ManufacturerRequestPage from './pages/ManufacturerRequestPage';
import ProducerOnboardingPage from './pages/ProducerOnboardingPage';
import QuotationSubmitPage from './pages/QuotationSubmitPage';
import {
  AdminDashboardPage,
  AdminLoginPage,
  ApprovedProducersPage,
  ManufacturerRequestsPage,
  MatchingPage,
  PendingProducerRequestsPage,
  QuotationComparisonPage
} from './pages/AdminPages';

function RequireAdmin({ children }) {
  return localStorage.getItem('adminToken') ? children : <Navigate to="/admin/login" replace />;
}

const MatchWrapper = () => {
  const { requestId } = useParams();
  return <RequireAdmin><MatchingPage requestId={requestId} /></RequireAdmin>;
};

const CompareWrapper = () => {
  const { requestId } = useParams();
  return <RequireAdmin><QuotationComparisonPage requestId={requestId} /></RequireAdmin>;
};

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/producer-request" element={<ProducerRequestPage />} />
        <Route path="/manufacturer-request" element={<ManufacturerRequestPage />} />
        <Route path="/producer-onboarding" element={<ProducerOnboardingPage />} />
        <Route path="/quotation-submit" element={<QuotationSubmitPage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
        <Route path="/admin/producer-requests" element={<RequireAdmin><PendingProducerRequestsPage /></RequireAdmin>} />
        <Route path="/admin/approved-producers" element={<RequireAdmin><ApprovedProducersPage /></RequireAdmin>} />
        <Route path="/admin/manufacturer-requests" element={<RequireAdmin><ManufacturerRequestsPage /></RequireAdmin>} />
        <Route path="/admin/matching/:requestId" element={<MatchWrapper />} />
        <Route path="/admin/quotations/:requestId" element={<CompareWrapper />} />
      </Routes>
    </MainLayout>
  );
}
