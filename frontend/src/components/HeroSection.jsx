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
      case 'warning': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      case 'error': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'success': return 'bg-gradient-to-r from-green-600 to-green-700 text-white';
      case 'info': 
      default: return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white';
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
    <div className="relative bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Important Updates Banner */}
      {showBanner && (
        <div className={`${getBannerColors(importantUpdate.type)} py-3 px-4 text-center relative`}>
          <div className="flex items-center justify-center space-x-2 text-sm">
            {getBannerIcon(importantUpdate.type)}
            <span>{importantUpdate.message}</span>
            <span className="font-semibold hidden sm:inline">{importantUpdate.details}</span>
            {importantUpdate.actionText && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4 bg-white text-blue-600 hover:bg-gray-100"
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
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
              className="relative overflow-hidden rounded-2xl shadow-2xl mb-6"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={mockUSAImages[currentImageIndex]}
                alt="USA Destination"
                className="w-full h-[400px] object-cover transition-all duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2">USA Visa Services</h1>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                <span className="text-blue-600">USA Visa</span> from USA
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Get your US visa hassle-free with <span className="font-semibold text-blue-600">KPVS</span>. We offer quick processing, 
                expert assistance, and guaranteed on-time delivery 
                for American Citizens.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">3-5 days</div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                </div>
              </Card>
              <Card className="p-6 border-2 border-green-100 hover:border-green-300 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-500"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">10 years</div>
                  <div className="text-sm text-gray-600">Visa Validity</div>
                </div>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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