import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Intro from "./pages/Intro";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import CreatedImage from "./pages/CreatedImage";
import EditImage from "./pages/EditImage";
import Referral from "./pages/Referral";
import Success from "./pages/Success";
import Upgrade from "./pages/Upgrade";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Creations from "./pages/Creations";
import Space from "./pages/Space";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/created-image" element={<CreatedImage />} />
          <Route path="/edit-image" element={<EditImage />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/success" element={<Success />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/creations" element={<Creations />} />
          <Route path="/space" element={<Space />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
