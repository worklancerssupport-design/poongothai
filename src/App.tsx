import { useState } from "react";
import { Routes, Route } from "react-router-dom";
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

function HomePage() {
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);

  const scrollToHairstyles = () => {
    document.getElementById("hairstyles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
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
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/edit" element={<EditPage />} />
      <Route path="/data-test" element={<DataTest />} />
    </Routes>
  );
}
