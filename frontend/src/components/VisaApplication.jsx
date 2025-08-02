import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Calendar, User, FileText, CreditCard, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { mockApplicationSteps } from '../data/mock';
import { visaApplicationsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const VisaApplication = () => {
  const { isAuthenticated } = useAuth();
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applicationId, setApplicationId] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Visa types data
  const visaTypes = [
    { id: "tourist", name: "Tourist Visa (B-2)", duration: "Up to 180 days", validity: "10 years", price: 185 },
    { id: "business", name: "Business Visa (B-1)", duration: "Up to 180 days", validity: "10 years", price: 185 },
    { id: "student", name: "Student Visa (F-1)", duration: "Duration of studies", validity: "Variable", price: 185 },
    { id: "transit", name: "Transit Visa (C)", duration: "Up to 29 days", validity: "3 months", price: 185 }
  ];

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    citizenship: 'US',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    
    // Travel Details
    travelPurpose: '',
    arrivalDate: '',
    departureDate: '',
    accommodation: '',
    previousVisits: false,
    
    // Passport Information
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuingCountry: 'US'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear errors when user starts typing
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return selectedVisaType !== '';
      case 2:
        return formData.fullName && formData.email && formData.citizenship;
      case 3:
        return formData.travelPurpose && formData.arrivalDate;
      case 4:
        return formData.passportNumber && formData.passportExpiryDate;
      default:
        return true;
    }
  };

  const saveApplication = async () => {
    if (!isAuthenticated) {
      setError('Please login to save your application');
      setIsAuthModalOpen(true);
      return false;
    }

    try {
      setLoading(true);
      setError('');

      const selectedVisa = visaTypes.find(v => v.id === selectedVisaType);
      
      const applicationData = {
        visaType: selectedVisa ? {
          id: selectedVisa.id,
          name: selectedVisa.name,
          duration: selectedVisa.duration,
          validity: selectedVisa.validity,
          price: selectedVisa.price
        } : null,
        personalInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          citizenship: formData.citizenship,
          dateOfBirth: formData.dateOfBirth || null,
          placeOfBirth: formData.placeOfBirth,
          gender: formData.gender
        },
        travelDetails: {
          purpose: formData.travelPurpose,
          arrivalDate: formData.arrivalDate || null,
          departureDate: formData.departureDate || null,
          accommodation: formData.accommodation,
          previousVisits: formData.previousVisits
        },
        passportInfo: {
          number: formData.passportNumber,
          issueDate: formData.passportIssueDate || null,
          expiryDate: formData.passportExpiryDate || null,
          issuingCountry: formData.passportIssuingCountry
        }
      };

      let response;
      if (applicationId) {
        // Update existing application
        response = await visaApplicationsAPI.update(applicationId, {
          ...applicationData,
          currentStep,
          completedSteps: Array.from({length: currentStep - 1}, (_, i) => i + 1)
        });
      } else {
        // Create new application
        response = await visaApplicationsAPI.create(applicationData);
        if (response.data.success) {
          setApplicationId(response.data.data.application_id);
        }
      }

      if (response.data.success) {
        setSuccess('Application saved successfully!');
        return true;
      } else {
        setError('Failed to save application');
        return false;
      }
    } catch (err) {
      console.error('Error saving application:', err);
      setError(err.response?.data?.detail || 'Failed to save application');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      setError('Please fill in all required fields');
      return;
    }

    // Save application before proceeding
    const saved = await saveApplication();
    if (!saved) return;

    if (currentStep < mockApplicationSteps.length) {
      setCurrentStep(currentStep + 1);
      setError('');
      setSuccess('');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
      setSuccess('');
    }
  };

  const getStepIcon = (iconName) => {
    const icons = {
      FileText,
      CreditCard,
      Calendar,
      User,
      CheckCircle
    };
    const Icon = icons[iconName] || FileText;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold kpvs-text-gray-900 mb-4">
            Start Your USA Visa Application
          </h2>
          <p className="text-xl kpvs-text-gray-700">
            Complete your application in a few simple steps
          </p>
          {!isAuthenticated && (
            <div className="mt-4 max-w-md mx-auto kpvs-bg-warning-light kpvs-border-warning rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 kpvs-text-warning-dark mt-0.5 flex-shrink-0" />
                <p className="text-sm kpvs-text-warning-dark">
                  Please login to save your progress and submit your application.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Steps - Left Column */}
          <div className="lg:col-span-1">
            <div className="kpvs-card">
              <div className="p-6 border-b kpvs-border-gray-200">
                <h3 className="text-lg font-semibold kpvs-text-gray-900">Application Progress</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockApplicationSteps.map((step) => (
                    <div
                      key={step.step}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                        currentStep === step.step
                          ? 'kpvs-bg-blue-50 border-l-4 kpvs-border-blue'
                          : currentStep > step.step
                          ? 'kpvs-bg-success-light'
                          : 'kpvs-bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          currentStep === step.step
                            ? 'kpvs-bg-blue text-white'
                            : currentStep > step.step
                            ? 'kpvs-bg-success text-white'
                            : 'kpvs-bg-gray-300 kpvs-text-gray-600'
                        }`}
                      >
                        {currentStep > step.step ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.step}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium kpvs-text-gray-900">
                          {step.title}
                        </p>
                        <p className="text-xs kpvs-text-gray-600 mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Application Form - Right Column */}
          <div className="lg:col-span-2">
            <div className="kpvs-card">
              <div className="p-6 border-b kpvs-border-gray-200">
                <h3 className="flex items-center space-x-2 text-lg font-semibold kpvs-text-gray-900">
                  {getStepIcon(mockApplicationSteps[currentStep - 1]?.icon)}
                  <span>{mockApplicationSteps[currentStep - 1]?.title}</span>
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* Error and Success Messages */}
                {error && (
                  <div className="kpvs-bg-error-light kpvs-border-error rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 kpvs-text-error mt-0.5 flex-shrink-0" />
                      <p className="text-sm kpvs-text-error-dark">{error}</p>
                    </div>
                  </div>
                )}
                
                {success && (
                  <div className="kpvs-bg-success-light kpvs-border-success rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 kpvs-text-success mt-0.5 flex-shrink-0" />
                      <p className="text-sm kpvs-text-success-dark">{success}</p>
                    </div>
                  </div>
                )}

                {/* Step 1: Visa Type Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Select Visa Type</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {visaTypes.map((visa) => (
                          <div
                            key={visa.id}
                            className={`kpvs-card cursor-pointer transition-all hover:kpvs-shadow-md ${
                              selectedVisaType === visa.id
                                ? 'ring-2 kpvs-border-blue kpvs-bg-blue-50'
                                : 'hover:kpvs-border-blue-light'
                            }`}
                            onClick={() => setSelectedVisaType(visa.id)}
                          >
                            <div className="p-4">
                              <h4 className="font-semibold kpvs-text-gray-900">{visa.name}</h4>
                              <div className="mt-2 space-y-1 text-sm kpvs-text-gray-600">
                                <p>Duration: {visa.duration}</p>
                                <p>Valid for: {visa.validity}</p>
                                <div className="flex items-center justify-between mt-3">
                                  <span className="kpvs-badge-primary">${visa.price}</span>
                                  {selectedVisaType === visa.id && (
                                    <CheckCircle className="h-5 w-5 kpvs-text-success" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="citizenship">Citizenship *</Label>
                        <Input
                          id="citizenship"
                          value={formData.citizenship}
                          onChange={(e) => handleInputChange('citizenship', e.target.value)}
                          placeholder="Country code (e.g., US)"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Travel Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Travel Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="travelPurpose">Purpose of Travel *</Label>
                        <Textarea
                          id="travelPurpose"
                          value={formData.travelPurpose}
                          onChange={(e) => handleInputChange('travelPurpose', e.target.value)}
                          placeholder="Describe the purpose of your visit to the USA"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="arrivalDate">Arrival Date *</Label>
                          <Input
                            id="arrivalDate"
                            type="date"
                            value={formData.arrivalDate}
                            onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="departureDate">Departure Date</Label>
                          <Input
                            id="departureDate"
                            type="date"
                            value={formData.departureDate}
                            onChange={(e) => handleInputChange('departureDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accommodation">Accommodation Details</Label>
                        <Textarea
                          id="accommodation"
                          value={formData.accommodation}
                          onChange={(e) => handleInputChange('accommodation', e.target.value)}
                          placeholder="Where will you be staying in the USA?"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Passport Information */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Passport Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passportNumber">Passport Number *</Label>
                        <Input
                          id="passportNumber"
                          value={formData.passportNumber}
                          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                          placeholder="Enter passport number"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="passportExpiryDate">Passport Expiry Date *</Label>
                        <Input
                          id="passportExpiryDate"
                          type="date"
                          value={formData.passportExpiryDate}
                          onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="passportIssueDate">Passport Issue Date</Label>
                        <Input
                          id="passportIssueDate"
                          type="date"
                          value={formData.passportIssueDate}
                          onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passportIssuingCountry">Issuing Country</Label>
                        <Input
                          id="passportIssuingCountry"
                          value={formData.passportIssuingCountry}
                          onChange={(e) => handleInputChange('passportIssuingCountry', e.target.value)}
                          placeholder="Country code (e.g., US)"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Steps 5 & 6: Completion Messages */}
                {currentStep > 4 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Step {currentStep} Completed!
                    </h3>
                    <p className="text-gray-600">
                      {mockApplicationSteps[currentStep - 1]?.description}
                    </p>
                    {currentStep === mockApplicationSteps.length && (
                      <div className="mt-6">
                        <Badge className="bg-green-500 text-white px-4 py-2">
                          Application Ready for Submission
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t kpvs-border-gray-200">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1 || loading}
                    className="kpvs-btn-secondary"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep === mockApplicationSteps.length || loading}
                    className="kpvs-btn-primary"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : currentStep === mockApplicationSteps.length ? (
                      'Complete'
                    ) : (
                      'Next Step'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default VisaApplication;