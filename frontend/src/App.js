import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import VisaApplication from "./components/VisaApplication";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CitizenshipModal from "./components/CitizenshipModal";
import { Toaster } from "./components/ui/toaster";

const HomePage = () => {
  const [isCitizenshipModalOpen, setIsCitizenshipModalOpen] = useState(false);
  const [selectedCitizenship, setSelectedCitizenship] = useState({
    code: 'US',
    name: 'United States',
    flag: 'https://media.atlys.com/image/upload/country_flags/us.svg'
  });

  const handleCitizenshipSelect = (country) => {
    setSelectedCitizenship(country);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection 
        onCitizenshipClick={() => setIsCitizenshipModalOpen(true)}
        selectedCitizenship={selectedCitizenship}
      />
      <VisaApplication />
      <FAQ />
      
      <CitizenshipModal
        isOpen={isCitizenshipModalOpen}
        onClose={() => setIsCitizenshipModalOpen(false)}
        onSelect={handleCitizenshipSelect}
        selectedCountry={selectedCitizenship}
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;