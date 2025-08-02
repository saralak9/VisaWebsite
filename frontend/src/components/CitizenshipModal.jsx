import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, X, Loader2 } from 'lucide-react';
import { countriesAPI } from '../services/api';

const CitizenshipModal = ({ isOpen, onClose, onSelect, selectedCountry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load countries when modal opens
  useEffect(() => {
    if (isOpen && countries.length === 0) {
      loadCountries();
    }
  }, [isOpen, countries.length]);

  // Filter countries based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchQuery, countries]);

  const loadCountries = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await countriesAPI.getAll();
      
      if (response.data.success) {
        setCountries(response.data.data);
        setFilteredCountries(response.data.data);
      } else {
        setError('Failed to load countries');
      }
    } catch (err) {
      console.error('Error loading countries:', err);
      setError('Failed to load countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country) => {
    onSelect(country);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Citizenship</h3>
              <p className="text-sm text-gray-600 mt-1">
                This is the nationality mentioned on your passport. It determines your visa requirements and where you can travel visa-free
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Selection */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">I live in USA and am a citizen of</p>
            {selectedCountry && (
              <div className="flex items-center space-x-2">
                <img 
                  src={selectedCountry.flag} 
                  alt={selectedCountry.name}
                  className="w-6 h-6 rounded"
                />
                <span className="font-medium">{selectedCountry.name}</span>
                <Badge variant="outline" className="ml-auto">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                  Selected
                </Badge>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter a new citizenship"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading countries...</span>
            </div>
          ) : (
            /* Countries List */
            <div className="max-h-96 overflow-y-auto space-y-1">
              <p className="text-sm text-gray-600 mb-2">
                All citizenships [{filteredCountries.length}]
              </p>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <img 
                      src={country.flag} 
                      alt={country.name}
                      className="w-5 h-5 rounded"
                    />
                    <span className="flex-1 text-sm">{country.name}</span>
                    {selectedCountry?.code === country.code && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No countries found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CitizenshipModal;