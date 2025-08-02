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
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600">
          Find answers to common questions about USA visa applications
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
              )}
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-3 w-full"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading FAQs...</p>
          </CardContent>
        </Card>
      ) : faqs.length > 0 ? (
        /* FAQ Accordion */
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border border-gray-200 rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-start space-x-3 text-left">
                      <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {faq.question}
                        </h3>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="ml-8 prose prose-sm max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        /* No Results */
        <Card>
          <CardContent className="p-12 text-center">
            <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No FAQs found
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No results found for "${searchQuery}". Try adjusting your search terms.`
                : 'Try adjusting your category filter.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our visa experts are here to help you with your application process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Contact Support
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Schedule a Call
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;