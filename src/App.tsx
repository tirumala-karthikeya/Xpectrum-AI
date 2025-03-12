
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Partners from "./pages/Partners";
import CaseStudies from "./pages/CaseStudies";
import HRMS from "./pages/HRMS";
import Insurance from "./pages/Insurance";
import Hospitality from "./pages/Hospitality";
import QSR from "./pages/QSR";
import ContactPage from "./components/ContactPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/hrms" element={<HRMS />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/hospitality" element={<Hospitality />} />
          <Route path="/qsr" element={<QSR />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
