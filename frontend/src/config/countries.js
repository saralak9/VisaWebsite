// KPVS Supported Countries Configuration
// This file manages which countries KPVS currently supports for visa services

export const SUPPORTED_COUNTRIES = [
  {
    code: 'us',
    name: 'US',
    flag: 'https://media.atlys.com/image/upload/country_flags/us.svg',
    fullName: 'United States',
    isActive: true,
    visaTypes: ['Tourist (B-2)', 'Business (B-1)', 'Student (F-1)', 'Transit (C)']
  }
];

// Future expansion - countries to add when business grows:
export const FUTURE_COUNTRIES = [
  {
    code: 'in',
    name: 'IN',
    flag: 'https://media.atlys.com/image/upload/country_flags/in.svg',
    fullName: 'India',
    isActive: false,
    visaTypes: ['Tourist', 'Business', 'Medical']
  },
  {
    code: 'ca', 
    name: 'CA',
    flag: 'https://media.atlys.com/image/upload/country_flags/ca.svg',
    fullName: 'Canada',
    isActive: false,
    visaTypes: ['Tourist', 'Business', 'Student', 'Work']
  },
  {
    code: 'gb',
    name: 'GB', 
    flag: 'https://media.atlys.com/image/upload/country_flags/gb.svg',
    fullName: 'United Kingdom',
    isActive: false,
    visaTypes: ['Tourist', 'Business', 'Student']
  },
  {
    code: 'au',
    name: 'AU',
    flag: 'https://media.atlys.com/image/upload/country_flags/au.svg', 
    fullName: 'Australia',
    isActive: false,
    visaTypes: ['Tourist', 'Business', 'Student', 'Work']
  }
];

// Instructions for adding new countries:
// 1. Move a country from FUTURE_COUNTRIES to SUPPORTED_COUNTRIES
// 2. Set isActive: true
// 3. Update the backend to handle the new country
// 4. Create country-specific visa application forms
// 5. Add country-specific FAQs
// 6. Test the complete flow

export const getActiveCountries = () => {
  return SUPPORTED_COUNTRIES.filter(country => country.isActive);
};

export const getAllCountries = () => {
  return [...SUPPORTED_COUNTRIES, ...FUTURE_COUNTRIES];
};