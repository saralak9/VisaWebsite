import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Calendar, User, FileText, CreditCard, CheckCircle } from 'lucide-react';
import { mockVisaTypes, mockApplicationSteps } from '../data/mock';

const VisaApplication = () => {
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    citizenship: 'US',
    travelPurpose: '',
    travelDates: '',
    passportNumber: '',
    passportExpiry: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < mockApplicationSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Start Your USA Visa Application
        </h2>
        <p className="text-xl text-gray-600">
          Complete your application in a few simple steps
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Steps - Left Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockApplicationSteps.map((step) => (
                  <div
                    key={step.step}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                      currentStep === step.step
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : currentStep > step.step
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === step.step
                          ? 'bg-blue-500 text-white'
                          : currentStep > step.step
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {currentStep > step.step ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{step.step}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Form - Right Column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStepIcon(mockApplicationSteps[currentStep - 1]?.icon)}
                <span>{mockApplicationSteps[currentStep - 1]?.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Visa Type</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {mockVisaTypes.map((visa) => (
                        <Card
                          key={visa.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedVisaType === visa.id.toString()
                              ? 'ring-2 ring-blue-500 bg-blue-50'
                              : ''
                          }`}
                          onClick={() => setSelectedVisaType(visa.id.toString())}
                        >
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900">{visa.name}</h4>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <p>Duration: {visa.duration}</p>
                              <p>Valid for: {visa.validity}</p>
                              <div className="flex items-center justify-between mt-3">
                                <Badge variant="secondary">${visa.price}</Badge>
                                {selectedVisaType === visa.id.toString() && (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
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
                      <Label htmlFor="citizenship">Citizenship</Label>
                      <Select value={formData.citizenship} onValueChange={(value) => handleInputChange('citizenship', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Travel Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="travelPurpose">Purpose of Travel</Label>
                      <Textarea
                        id="travelPurpose"
                        value={formData.travelPurpose}
                        onChange={(e) => handleInputChange('travelPurpose', e.target.value)}
                        placeholder="Describe the purpose of your visit to the USA"
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="travelDates">Travel Dates</Label>
                        <Input
                          id="travelDates"
                          type="date"
                          value={formData.travelDates}
                          onChange={(e) => handleInputChange('travelDates', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passportNumber">Passport Number</Label>
                        <Input
                          id="passportNumber"
                          value={formData.passportNumber}
                          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                          placeholder="Enter passport number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep > 3 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Step {currentStep} Completed!
                  </h3>
                  <p className="text-gray-600">
                    {mockApplicationSteps[currentStep - 1]?.description}
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={currentStep === mockApplicationSteps.length}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === mockApplicationSteps.length ? 'Complete' : 'Next Step'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisaApplication;