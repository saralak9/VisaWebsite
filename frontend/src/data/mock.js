// Mock data for KPVS USA Visa Application

export const mockFAQs = [
  {
    id: 1,
    category: "General Information",
    question: "Do American Citizens need a visa for the US?",
    answer: "Yes, American Citizens need a visa to enter the United States, whether visiting for tourism, business, education, or other purposes."
  },
  {
    id: 2,
    category: "General Information", 
    question: "What are the eligibility criteria for American Citizens to get a US visa?",
    answer: "American Citizens are eligible for getting a US visa, provided they can prove that:\n\n• The trip to the US is for a temporary visit, such as business, tourism, or family.\n• The stay in the US is planned for a limited period.\n• There is sufficient evidence of funds to cover expenses while in the US.\n• There is a residence and strong ties outside the US that ensure a return after the visit."
  },
  {
    id: 3,
    category: "General Information",
    question: "What are the US visa requirements for USA citizens?",
    answer: "Here is a list of documents required to apply for a US tourist visa from USA:\n\n• A complete Nonimmigrant Visa Application or Form DS-160.\n• The passport valid for at least six months beyond the intended stay in the US.\n• A passport-size photo that meets the US visa photo requirements.\n\nAdditional documents required for US visa appointments:\n• DS-160 Form Confirmation page\n• Appointment confirmation page\n• Fee payment receipt\n• Proof of the trip's purpose (e.g., cover letter, travel itinerary, etc.)\n• Proof of sufficient funds (preferably bank statements of the last 6 months)\n• Proof of your intent to return to your home country (letter of employment or the leave approval letter)."
  },
  {
    id: 4,
    category: "General Information",
    question: "How to apply for a US visa from USA?",
    answer: "Here is how American Citizens can apply for a US visa from USA:\n\nStep 1: Carefully complete the DS-160 Form online.\nStep 2: Create an account on the USA government website to pay your US visa fees.\nStep 3: After paying the fee, schedule the VAC (for biometrics) and embassy appointments (for a personal interview).\nStep 4: Visit the VAC to submit your biometric information and take the appointment confirmation page, DS-160 Confirmation page, and passport.\nStep 5: On the interview day, submit your supporting documents and answer any questions the officer asks.\nStep 6: You will be informed about the visa decision immediately after your interview. If approved, submit your passport for visa processing.\nStep 7: Once the visa is processed, you can collect your passport from the US passport collection centres or have it delivered."
  },
  {
    id: 5,
    category: "General Information",
    question: "How long is the US tourist visa valid for American Citizens?",
    answer: "A US tourist or B-2 visa for American Citizens is typically valid for 10 years from the issue date and allows a stay of up to 180 days per visit."
  },
  {
    id: 6,
    category: "General Information",
    question: "Is an interview mandatory for American Citizens to apply for a US tourist visa?",
    answer: "Yes, the US consular interview is mandatory for all American Citizens (except children under 14 and applicants aged 80 and over)."
  }
];

export const mockCountries = [
  { code: "US", name: "United States", flag: "https://media.atlys.com/image/upload/country_flags/us.svg" },
  { code: "IN", name: "India", flag: "https://media.atlys.com/image/upload/country_flags/in.svg" },
  { code: "GB", name: "United Kingdom", flag: "https://media.atlys.com/image/upload/country_flags/gb.svg" },
  { code: "CA", name: "Canada", flag: "https://media.atlys.com/image/upload/country_flags/ca.svg" },
  { code: "AU", name: "Australia", flag: "https://media.atlys.com/image/upload/country_flags/au.svg" },
  { code: "DE", name: "Germany", flag: "https://media.atlys.com/image/upload/country_flags/de.svg" },
  { code: "FR", name: "France", flag: "https://media.atlys.com/image/upload/country_flags/fr.svg" },
  { code: "JP", name: "Japan", flag: "https://media.atlys.com/image/upload/country_flags/jp.svg" },
  { code: "CN", name: "China", flag: "https://media.atlys.com/image/upload/country_flags/cn.svg" },
  { code: "BR", name: "Brazil", flag: "https://media.atlys.com/image/upload/country_flags/br.svg" }
];

export const mockVisaTypes = [
  { id: 1, name: "Tourist Visa (B-2)", duration: "Up to 180 days", validity: "10 years", price: 185 },
  { id: 2, name: "Business Visa (B-1)", duration: "Up to 180 days", validity: "10 years", price: 185 },
  { id: 3, name: "Student Visa (F-1)", duration: "Duration of studies", validity: "Variable", price: 185 },
  { id: 4, name: "Transit Visa (C)", duration: "Up to 29 days", validity: "3 months", price: 185 }
];

export const mockReviews = [
  {
    id: 1,
    platform: "Trustpilot",
    rating: 4.7,
    review: "Great service, got my visa approved quickly!",
    author: "Sarah M.",
    date: "2024-01-15"
  },
  {
    id: 2,
    platform: "Google Play",
    rating: 4.6,
    review: "Easy to use app, very helpful process.",
    author: "John D.",
    date: "2024-01-10"
  }
];

export const mockUSAImages = [
  "https://images.unsplash.com/reserve/D8ijGd3CSGq4BxJ9EzTf_13976945916_fa0ce84ee3_o.jpg?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxVU0ElMjBsYW5kbWFya3N8ZW58MHx8fHwxNzU0MTI0NDQ3fDA&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1555040479-d64e82b7bcc3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxVU0ElMjBsYW5kbWFya3N8ZW58MHx8fHwxNzU0MTI0NDQ3fDA&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1533089302392-1a1c3d5367ea?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxVU0ElMjBsYW5kbWFya3N8ZW58MHx8fHwxNzU0MTI0NDQ3fDA&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1682090612713-dec5831fa793?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxVU0ElMjBsYW5kbWFya3N8ZW58MHx8fHwxNzU0MTI0NDQ3fDA&ixlib=rb-4.1.0&q=85",
  "https://images.pexels.com/photos/33258089/pexels-photo-33258089.jpeg",
  "https://images.pexels.com/photos/33248808/pexels-photo-33248808.jpeg"
];

export const mockApplicationSteps = [
  {
    step: 1,
    title: "Complete DS-160 Form",
    description: "Fill out the online nonimmigrant visa application form",
    icon: "FileText"
  },
  {
    step: 2,
    title: "Pay Visa Fee",
    description: "Pay the required visa application fee online",
    icon: "CreditCard"
  },
  {
    step: 3,
    title: "Schedule Appointments",
    description: "Book VAC and embassy appointment slots",
    icon: "Calendar"
  },
  {
    step: 4,
    title: "Submit Biometrics",
    description: "Visit VAC for biometric information collection",
    icon: "Fingerprint"
  },
  {
    step: 5,
    title: "Attend Interview",
    description: "Attend consular interview at the embassy",
    icon: "Users"
  },
  {
    step: 6,
    title: "Collect Passport",
    description: "Receive your passport with visa stamp",
    icon: "CheckCircle"
  }
];