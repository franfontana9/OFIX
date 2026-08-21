import { Suspense, lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { PageFallback } from "@/components/PageFallback";
import { useAuth } from "@/lib/auth";

// Todas las pantallas se cargan por demanda (code-splitting por ruta): el bundle
// inicial queda chico y las dependencias pesadas (Leaflet en el mapa) sólo se
// descargan cuando el usuario entra a la pantalla que las usa.
const Landing = lazy(() => import("@/pages/Landing"));
const Explore = lazy(() => import("@/pages/Explore"));
const PublicWorker = lazy(() => import("@/pages/PublicWorker"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Forgot = lazy(() => import("@/pages/auth/Forgot"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const NotFound = lazy(() => import("@/pages/NotFound"));
// Seguimiento compartido con un contacto de confianza: público, sin login.
const TrackShared = lazy(() => import("@/pages/TrackShared"));

// Usuario / cliente
const UserHome = lazy(() => import("@/pages/u/Home"));
const UserSearch = lazy(() => import("@/pages/u/Search"));
const UserMapView = lazy(() => import("@/pages/u/MapView"));
const UserWorkerProfile = lazy(() => import("@/pages/u/WorkerProfile"));
const UserRequests = lazy(() => import("@/pages/u/Requests"));
const UserNewRequest = lazy(() => import("@/pages/u/NewRequest"));
const UserRequestDetail = lazy(() => import("@/pages/u/RequestDetail"));
const UserHire = lazy(() => import("@/pages/u/Hire"));
const UserPay = lazy(() => import("@/pages/u/Pay"));
const UserJobs = lazy(() => import("@/pages/u/Jobs"));
const UserJobDetail = lazy(() => import("@/pages/u/JobDetail"));
const UserReceipt = lazy(() => import("@/pages/u/Receipt"));
const UserReview = lazy(() => import("@/pages/u/Review"));
const UserDispute = lazy(() => import("@/pages/u/Dispute"));
const UserWarranty = lazy(() => import("@/pages/u/Warranty"));
const UserProperties = lazy(() => import("@/pages/u/Properties"));
const UserRecurring = lazy(() => import("@/pages/u/Recurring"));
const UserFavorites = lazy(() => import("@/pages/u/Favorites"));
const UserEmergency = lazy(() => import("@/pages/u/Emergency"));
const UserBusiness = lazy(() => import("@/pages/u/Business"));
const UserAgenda = lazy(() => import("@/pages/u/Agenda"));
const UserChat = lazy(() => import("@/pages/u/Chat"));
const UserChatDetail = lazy(() => import("@/pages/u/ChatDetail"));
const UserNotifications = lazy(() => import("@/pages/u/Notifications"));
const UserProfile = lazy(() => import("@/pages/u/Profile"));
const UserSettings = lazy(() => import("@/pages/u/Settings"));

// Trabajador
const WorkerHome = lazy(() => import("@/pages/w/Home"));
const WorkerJobs = lazy(() => import("@/pages/w/Jobs"));
const WorkerJobDetail = lazy(() => import("@/pages/w/JobDetail"));
const WorkerServices = lazy(() => import("@/pages/w/Services"));
const WorkerNewService = lazy(() => import("@/pages/w/NewService"));
const WorkerEditService = lazy(() => import("@/pages/w/EditService"));
const WorkerProposals = lazy(() => import("@/pages/w/Proposals"));
const WorkerAgreements = lazy(() => import("@/pages/w/Agreements"));
const WorkerAgreementDetail = lazy(() => import("@/pages/w/AgreementDetail"));
const WorkerAgreementReview = lazy(() => import("@/pages/w/AgreementReview"));
const WorkerCobros = lazy(() => import("@/pages/w/Cobros"));
const WorkerStats = lazy(() => import("@/pages/w/Stats"));
const WorkerUserProfile = lazy(() => import("@/pages/w/UserProfile"));
const WorkerAgenda = lazy(() => import("@/pages/w/Agenda"));
const WorkerChat = lazy(() => import("@/pages/w/Chat"));
const WorkerChatDetail = lazy(() => import("@/pages/w/ChatDetail"));
const WorkerNotifications = lazy(() => import("@/pages/w/Notifications"));
const WorkerProfile = lazy(() => import("@/pages/w/Profile"));
const WorkerVerification = lazy(() => import("@/pages/w/Verification"));
const WorkerPremium = lazy(() => import("@/pages/w/Premium"));
const WorkerSettings = lazy(() => import("@/pages/w/Settings"));

export default function App() {
  const initialize = useAuth((s) => s.initialize);
  useEffect(() => initialize(), [initialize]);

  return (
    <>
      <Toaster />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/p/:id" element={<PublicWorker />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot" element={<Forgot />} />
          {/* Link que el cliente comparte con un familiar: no requiere cuenta. */}
          <Route path="/t/:token" element={<TrackShared />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />


          {/* Usuario / cliente */}
          <Route element={<ProtectedRoute requiredRole="user"><AppLayout /></ProtectedRoute>}>
            <Route path="/u/home" element={<UserHome />} />
            <Route path="/u/search" element={<UserSearch />} />
            <Route path="/u/map" element={<UserMapView />} />
            <Route path="/u/workers/:id" element={<UserWorkerProfile />} />
            <Route path="/u/requests" element={<UserRequests />} />
            <Route path="/u/requests/new" element={<UserNewRequest />} />
            <Route path="/u/requests/:id" element={<UserRequestDetail />} />
            <Route path="/u/requests/:id/hire" element={<UserHire />} />
            <Route path="/u/pay/:jobId" element={<UserPay />} />
            <Route path="/u/jobs" element={<UserJobs />} />
            <Route path="/u/jobs/:id" element={<UserJobDetail />} />
            <Route path="/u/jobs/:id/receipt" element={<UserReceipt />} />
            <Route path="/u/jobs/:id/review" element={<UserReview />} />
            <Route path="/u/jobs/:id/dispute" element={<UserDispute />} />
            <Route path="/u/jobs/:id/warranty" element={<UserWarranty />} />
            <Route path="/u/properties" element={<UserProperties />} />
            <Route path="/u/recurring" element={<UserRecurring />} />
            <Route path="/u/favorites" element={<UserFavorites />} />
            <Route path="/u/emergency/:id" element={<UserEmergency />} />
            <Route path="/u/business" element={<UserBusiness />} />
            <Route path="/u/agenda" element={<UserAgenda />} />
            <Route path="/u/chat" element={<UserChat />} />
            <Route path="/u/chat/:id" element={<UserChatDetail />} />
            <Route path="/u/notifications" element={<UserNotifications />} />
            <Route path="/u/profile" element={<UserProfile />} />
            <Route path="/u/settings" element={<UserSettings />} />
          </Route>

          {/* Trabajador */}
          <Route element={<ProtectedRoute requiredRole="worker"><AppLayout /></ProtectedRoute>}>
            <Route path="/w/home" element={<WorkerHome />} />
            <Route path="/w/jobs" element={<WorkerJobs />} />
            <Route path="/w/jobs/:id" element={<WorkerJobDetail />} />
            <Route path="/w/services" element={<WorkerServices />} />
            <Route path="/w/services/new" element={<WorkerNewService />} />
            <Route path="/w/services/:id/edit" element={<WorkerEditService />} />
            <Route path="/w/proposals" element={<WorkerProposals />} />
            <Route path="/w/agreements" element={<WorkerAgreements />} />
            <Route path="/w/agreements/:id" element={<WorkerAgreementDetail />} />
            <Route path="/w/agreements/:id/review" element={<WorkerAgreementReview />} />
            <Route path="/w/cobros" element={<WorkerCobros />} />
            <Route path="/w/stats" element={<WorkerStats />} />
            <Route path="/w/users/:id" element={<WorkerUserProfile />} />
            <Route path="/w/agenda" element={<WorkerAgenda />} />
            <Route path="/w/chat" element={<WorkerChat />} />
            <Route path="/w/chat/:id" element={<WorkerChatDetail />} />
            <Route path="/w/notifications" element={<WorkerNotifications />} />
            <Route path="/w/profile" element={<WorkerProfile />} />
            <Route path="/w/verification" element={<WorkerVerification />} />
            <Route path="/w/premium" element={<WorkerPremium />} />
            <Route path="/w/settings" element={<WorkerSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
