import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import MobileNavbar from "@/components/MobileNavbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Messages from "./pages/Messages";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import ProfilePost from "./pages/ProfilePost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const hasLoginCookie = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith("login="));
};

const RequireAuth = ({ children }: { children: JSX.Element; }) => {
  return hasLoginCookie() ? children : <Navigate to="/signin" replace />;
};

const RedirectIfAuth = ({ children }: { children: JSX.Element; }) => {
  return hasLoginCookie() ? <Navigate to="/" replace /> : children;
};

const AppContainer = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/signin") || location.pathname.startsWith("/signup");
  const wrapperClassName = isAuthPage ? "w-full" : "w-full max-w-[1400px] mx-auto";
  const showMobileNav = !isAuthPage;

  return (
    <div className={wrapperClassName}>
      {showMobileNav && <MobileNavbar />}
      <Routes>
        {/* Root affiche Home si loggé, sinon redirige vers /signin */}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />

        {/* Auth pages */}
        <Route path="/signin" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        <Route path="/signup" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />

        {/* Autres pages */}
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        {/* Supprimé la route /profile car on utilise /user/:username à la place */}
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        <Route path="/u/:username" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/profile/:postId" element={<RequireAuth><ProfilePost /></RequireAuth>} />
        <Route path="/u/:username/:postId" element={<RequireAuth><ProfilePost /></RequireAuth>} />
        <Route path="/p/:postId" element={<RequireAuth><ProfilePost /></RequireAuth>} />
        <Route path="/logout" element={<Logout />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Ajouter un espace en bas pour éviter que le contenu ne soit caché par la barre de navigation mobile */}
      {showMobileNav && <div className="h-16 sm:h-0 block sm:hidden"></div>}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContainer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
