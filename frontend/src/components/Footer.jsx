import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const companyLinks = [
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Newsroom', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'Inwards Out', href: '#' }
  ];

  const productLinks = [
    { name: 'KPVS Platform', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Transparency', href: '#' },
    { name: 'Visa Pre Approval', href: '#' },
    { name: 'U.S. Mock Interview', href: '#' }
  ];

  const toolLinks = [
    { name: 'Visa Photo Checker', href: '#' },
    { name: 'Visa Glossary', href: '#' },
    { name: 'UAE Status Checker', href: '#' },
    { name: 'Vietnam Status Checker', href: '#' },
    { name: 'Passport Mobility Index', href: '#' },
    { name: 'Schengen Appointment Checker', href: '#' },
    { name: 'DS-160 Tool', href: '#' }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '301 Mission, San Francisco, CA, 94105'
    },
    {
      city: 'New York',
      address: '447 Broadway STE 851, New York, NY, 10013'
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Products</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Tools</h3>
            <ul className="space-y-3">
              {toolLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Offices</h3>
            <div className="space-y-6">
              {offices.map((office) => (
                <div key={office.city}>
                  <h4 className="font-medium text-white mb-2">{office.city}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {office.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* App Download Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on App Store" 
                className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
              />
              <img 
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                alt="Get it on Google Play" 
                className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Youtube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>© KPVS, All rights reserved</p>
            <div className="flex items-center space-x-6">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;