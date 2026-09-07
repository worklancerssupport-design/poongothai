import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Hairstyles from "@/components/Hairstyles";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Bridal from "@/components/Bridal";
import Gallery from "@/components/Gallery";
import Owner from "@/components/Owner";
import Testimonials from "@/components/Testimonials";
import Map from "@/components/Map";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import HairstyleCatalogue from "@/components/HairstyleCatalogue";
import CursorGlow from "@/components/CursorGlow";
import EditPage from "@/edit/EditPage";
import DataTest from "@/components/DataTest";
import { Component, type ReactNode } from "react";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(err: Error) { return { error: err.message }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace", background: "#F8F1E7", minHeight: "100vh" }}>
          <h2 style={{ color: "#c00" }}>Error</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "#333" }}>{this.state.error}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function HomePage() {
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);

  const scrollToHairstyles = () => {
    document.getElementById("hairstyles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <DataProvider>
      <CursorGlow />
      <AnnouncementTicker />
      <Navbar onOpenCatalogue={() => setIsCatalogueOpen(true)} />
      <main>
        <Hero
          onOpenCatalogue={() => setIsCatalogueOpen(true)}
          onScrollToHairstyles={scrollToHairstyles}
        />
        <Hairstyles />
        <Services />
        <Packages />
        <Bridal />
        <Gallery />
        <Owner />
        <Testimonials />
        <Map />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
      <HairstyleCatalogue
        isOpen={isCatalogueOpen}
        onClose={() => setIsCatalogueOpen(false)}
      />
    </DataProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/edit" element={<ErrorBoundary><EditPage /></ErrorBoundary>} />
      <Route path="/data-test" element={<DataTest />} />
    </Routes>
  );
}
