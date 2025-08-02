import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import VisaApplication from "./components/VisaApplication";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CitizenshipModal from "./components/CitizenshipModal";
import { mockCountries } from "./data/mock";

const HomePage = () => {
  const [isCitizenshipModalOpen, setIsCitizenshipModalOpen] = useState(false);
  const [selectedCitizenship, setSelectedCitizenship] = useState(
    mockCountries.find(country => country.code === 'US') || mockCountries[0]
  );

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;