import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { Search, HelpCircle, Loader2 } from 'lucide-react';
import { faqsAPI } from '../services/api';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Load FAQs on component mount
  useEffect(() => {
    loadFAQs();
  }, [selectedCategory]);

  // Search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchFAQs();
      } else if (!searchQuery.trim()) {
        loadFAQs();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedCategory]);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await faqsAPI.getAll(selectedCategory === 'All' ? null : selectedCategory);
      
      if (response.data.success) {
        setFaqs(response.data.data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(response.data.data.map(faq => faq.category))];
        setCategories(uniqueCategories);
      } else {
        setError('Failed to load FAQs');
      }
    } catch (err) {
      console.error('Error loading FAQs:', err);
      setError('Failed to load FAQs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchFAQs = async () => {
    try {
      setSearching(true);
      setError('');
      
      const response = await faqsAPI.search(
        searchQuery,
        selectedCategory === 'All' ? null : selectedCategory
      );
      
      if (response.data.success) {
        setFaqs(response.data.data);
      } else {
        setError('Search failed');
      }
    } catch (err) {
      console.error('Error searching FAQs:', err);
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when category changes
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold kpvs-text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl kpvs-text-gray-700">
          Find answers to common questions about USA visa applications
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 kpvs-card">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 kpvs-text-gray-600 h-5 w-5" />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 kpvs-text-gray-600 h-4 w-4 animate-spin" />
              )}
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-3 w-full kpvs-focus border-2 kpvs-border-gray-300 rounded-lg transition-colors hover:kpvs-border-blue-light"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'kpvs-bg-blue text-white kpvs-hover-blue'
                      : 'kpvs-bg-gray-100 kpvs-text-gray-700 hover:kpvs-bg-gray-200'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 kpvs-bg-error-light kpvs-border-error rounded-lg p-4">
          <p className="kpvs-text-error-dark text-center">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="kpvs-card">
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 kpvs-text-blue" />
            <p className="kpvs-text-gray-700">Loading FAQs...</p>
          </div>
        </div>
      ) : faqs.length > 0 ? (
        /* FAQ Accordion */
        <div className="kpvs-card">
          <div className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border kpvs-border-gray-200 rounded-lg px-4 hover:kpvs-shadow transition-shadow"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-start space-x-3 text-left">
                      <HelpCircle className="h-5 w-5 kpvs-text-blue mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold kpvs-text-gray-900 text-base">
                          {faq.question}
                        </h3>
                        <span className="kpvs-badge-primary mt-2 text-xs">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="ml-8 prose prose-sm max-w-none">
                      <div className="kpvs-text-gray-700 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      ) : (
        /* No Results */
        <div className="kpvs-card">
          <div className="p-12 text-center">
            <HelpCircle className="h-16 w-16 kpvs-text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold kpvs-text-gray-900 mb-2">
              No FAQs found
            </h3>
            <p className="kpvs-text-gray-600">
              {searchQuery 
                ? `No results found for "${searchQuery}". Try adjusting your search terms.`
                : 'Try adjusting your category filter.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Contact Support */}
      <div className="mt-8 kpvs-card kpvs-gradient-subtle border-2 kpvs-border-blue-200">
        <div className="p-8 text-center">
          <h3 className="text-xl font-semibold kpvs-text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="kpvs-text-gray-700 mb-6">
            Our visa experts are here to help you with your application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="kpvs-btn-primary px-6 py-3 rounded-lg font-medium">
              Contact Support
            </button>
            <button className="kpvs-btn-secondary px-6 py-3 rounded-lg font-medium">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;