import { Suspense, lazy, useEffect, type ComponentType } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { PageFallback } from "@/components/PageFallback";
import { useAuth } from "@/lib/auth";

const CHUNK_RELOAD_KEY = "ofix-chunk-reload";

/**
 * `lazy` con recuperación ante un chunk que no carga.
 *
 * Con code-splitting, los nombres de los chunks llevan hash. Si la app se
 * redeploya mientras alguien tiene una pestaña abierta, ese `index.html` viejo
 * pide un chunk que ya no existe y el `import()` falla: la pantalla queda en
 * blanco y ni el ErrorBoundary lo ve, porque el error vive en una promesa
 * adentro de Suspense.
 *
 * Ante ese fallo se recarga la página UNA sola vez (la bandera va en
 * sessionStorage) para tomar el index.html nuevo. Si vuelve a fallar después de
 * recargar, el error se propaga de verdad en vez de quedar en un loop.
 */
function lazyPage<T extends ComponentType<unknown>>(factory: () => Promise<{ default: T }>) {
  return lazy(() =>
    factory()
      .then((mod) => {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
        return mod;
      })
      .catch((err) => {
        if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
          sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
          window.location.reload();
        }
        throw err;
      }),
  );
}

// Todas las pantallas se cargan por demanda (code-splitting por ruta): el bundle
// inicial queda chico y las dependencias pesadas (Leaflet en el mapa) sólo se
// descargan cuando el usuario entra a la pantalla que las usa.
const Landing = lazyPage(() => import("@/pages/Landing"));
const Explore = lazyPage(() => import("@/pages/Explore"));
const PublicWorker = lazyPage(() => import("@/pages/PublicWorker"));
const Login = lazyPage(() => import("@/pages/auth/Login"));
const Register = lazyPage(() => import("@/pages/auth/Register"));
const Forgot = lazyPage(() => import("@/pages/auth/Forgot"));
const Onboarding = lazyPage(() => import("@/pages/Onboarding"));
const NotFound = lazyPage(() => import("@/pages/NotFound"));
// Seguimiento compartido con un contacto de confianza: público, sin login.
const TrackShared = lazyPage(() => import("@/pages/TrackShared"));

// Usuario / cliente
const UserHome = lazyPage(() => import("@/pages/u/Home"));
const UserSearch = lazyPage(() => import("@/pages/u/Search"));
const UserMapView = lazyPage(() => import("@/pages/u/MapView"));
const UserWorkerProfile = lazyPage(() => import("@/pages/u/WorkerProfile"));
const UserRequests = lazyPage(() => import("@/pages/u/Requests"));
const UserNewRequest = lazyPage(() => import("@/pages/u/NewRequest"));
const UserRequestDetail = lazyPage(() => import("@/pages/u/RequestDetail"));
const UserHire = lazyPage(() => import("@/pages/u/Hire"));
const UserPay = lazyPage(() => import("@/pages/u/Pay"));
const UserJobs = lazyPage(() => import("@/pages/u/Jobs"));
const UserJobDetail = lazyPage(() => import("@/pages/u/JobDetail"));
const UserReceipt = lazyPage(() => import("@/pages/u/Receipt"));
const UserReview = lazyPage(() => import("@/pages/u/Review"));
const UserDispute = lazyPage(() => import("@/pages/u/Dispute"));
const UserWarranty = lazyPage(() => import("@/pages/u/Warranty"));
const UserProperties = lazyPage(() => import("@/pages/u/Properties"));
const UserRecurring = lazyPage(() => import("@/pages/u/Recurring"));
const UserFavorites = lazyPage(() => import("@/pages/u/Favorites"));
const UserEmergency = lazyPage(() => import("@/pages/u/Emergency"));
const UserBusiness = lazyPage(() => import("@/pages/u/Business"));
const UserAgenda = lazyPage(() => import("@/pages/u/Agenda"));
const UserChat = lazyPage(() => import("@/pages/u/Chat"));
const UserChatDetail = lazyPage(() => import("@/pages/u/ChatDetail"));
const UserNotifications = lazyPage(() => import("@/pages/u/Notifications"));
const UserProfile = lazyPage(() => import("@/pages/u/Profile"));
const UserSettings = lazyPage(() => import("@/pages/u/Settings"));

// Trabajador
const WorkerHome = lazyPage(() => import("@/pages/w/Home"));
const WorkerJobs = lazyPage(() => import("@/pages/w/Jobs"));
const WorkerMapView = lazyPage(() => import("@/pages/w/MapView"));
const WorkerJobDetail = lazyPage(() => import("@/pages/w/JobDetail"));
const WorkerServices = lazyPage(() => import("@/pages/w/Services"));
const WorkerNewService = lazyPage(() => import("@/pages/w/NewService"));
const WorkerEditService = lazyPage(() => import("@/pages/w/EditService"));
const WorkerProposals = lazyPage(() => import("@/pages/w/Proposals"));
const WorkerAgreements = lazyPage(() => import("@/pages/w/Agreements"));
const WorkerAgreementDetail = lazyPage(() => import("@/pages/w/AgreementDetail"));
const WorkerAgreementReview = lazyPage(() => import("@/pages/w/AgreementReview"));
const WorkerCobros = lazyPage(() => import("@/pages/w/Cobros"));
const WorkerStats = lazyPage(() => import("@/pages/w/Stats"));
const WorkerUserProfile = lazyPage(() => import("@/pages/w/UserProfile"));
const WorkerAgenda = lazyPage(() => import("@/pages/w/Agenda"));
const WorkerChat = lazyPage(() => import("@/pages/w/Chat"));
const WorkerChatDetail = lazyPage(() => import("@/pages/w/ChatDetail"));
const WorkerNotifications = lazyPage(() => import("@/pages/w/Notifications"));
const WorkerProfile = lazyPage(() => import("@/pages/w/Profile"));
const WorkerVerification = lazyPage(() => import("@/pages/w/Verification"));
const WorkerPremium = lazyPage(() => import("@/pages/w/Premium"));
const WorkerSettings = lazyPage(() => import("@/pages/w/Settings"));

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
            <Route path="/w/map" element={<WorkerMapView />} />
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
