import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { mockUSAImages, mockReviews } from '../data/mock';
import { Star, Smartphone, Download, AlertCircle, X } from 'lucide-react';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Important updates configuration - easily editable
  const importantUpdate = {
    message: "🚨 Important: New visa requirements effective Feb 15, 2025",
    details: "All applicants must now provide biometric data. Learn more about the new process.",
    type: "warning", // "info", "warning", "success", or "error"
    actionText: "Learn More",
    actionUrl: "#faq", // or external URL
    dismissible: true
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % mockUSAImages.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const getBannerColors = (type) => {
    switch(type) {
      case 'warning': return 'bg-gradient-to-r from-kpvs-orange to-kpvs-red text-white';
      case 'error': return 'bg-gradient-to-r from-kpvs-red to-red-600 text-white';
      case 'success': return 'bg-gradient-to-r from-green-600 to-green-700 text-white';
      case 'info': 
      default: return 'bg-gradient-to-r from-kpvs-blue to-kpvs-blue-light text-white';
    }
  };

  const getBannerIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <AlertCircle className="h-4 w-4" />;
      case 'info':
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockUSAImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockUSAImages.length) % mockUSAImages.length);
  };

  return (
    <div className="relative kpvs-gradient-subtle">
      {/* Important Updates Banner */}
      {showBanner && (
        <div className={`${getBannerColors(importantUpdate.type)} py-3 px-4 text-center relative kpvs-shadow`}>
          <div className="flex items-center justify-center space-x-2 text-sm">
            {getBannerIcon(importantUpdate.type)}
            <span>{importantUpdate.message}</span>
            <span className="font-semibold hidden sm:inline">{importantUpdate.details}</span>
            {importantUpdate.actionText && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4 kpvs-btn-secondary bg-white border-white text-current hover:bg-white/90"
                onClick={() => {
                  if (importantUpdate.actionUrl.startsWith('#')) {
                    document.querySelector(importantUpdate.actionUrl)?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.open(importantUpdate.actionUrl, '_blank');
                  }
                }}
              >
                {importantUpdate.actionText}
              </Button>
            )}
            {importantUpdate.dismissible && (
              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Images */}
          <div className="relative">
            {/* Main Image */}
            <div 
              className="relative overflow-hidden rounded-2xl kpvs-shadow-xl mb-6"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={mockUSAImages[currentImageIndex]}
                alt="USA Destination"
                className="w-full h-[400px] object-cover transition-all duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">USA Visa Services</h1>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-5xl font-bold kpvs-text-gray-900 mb-4">
                <span className="kpvs-text-blue">USA Visa Services</span>
              </h2>
              <p className="text-xl kpvs-text-gray-700 leading-relaxed">
                Get your US visa hassle-free with KP Visa Services. We offer quick processing, expert assistance, and guaranteed on-time delivery.
              </p>
            </div>

            {/* Key Features */}
            <div className="flex justify-center mb-6">
              <div className="kpvs-card p-5 hover:kpvs-shadow-md transition-all">
                <div className="text-center">
                  <div className="text-lg font-semibold kpvs-text-gray-700">Appointment Availability: 2 Weeks</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="kpvs-btn-primary px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="relative">Start Your Application</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;