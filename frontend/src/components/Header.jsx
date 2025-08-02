import React, { useState } from 'react';
import { Search, User, Globe, Menu, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { getActiveCountries } from '../config/countries';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Get active countries for the selector
  const activeCountries = getActiveCountries();

  const handleLogout = () => {
    logout();
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      // Already authenticated, could show profile dropdown
      return;
    }
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="w-full bg-white border-b kpvs-border-gray-200 sticky top-0 z-50 kpvs-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              {/* KPVS Bold Logo */}
              <div className="flex items-center">
                <img 
                  src="https://customer-assets.emergentagent.com/job_visa-usa-journey/artifacts/m5nl3hc5_image-2-removebg%20copy.png" 
                  alt="KPVS - Anytime, Anywhere" 
                  className="h-8 w-auto"
                />
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 kpvs-text-gray-600 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search countries"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full kpvs-border-gray-300 rounded-lg kpvs-focus border-2 transition-colors hover:kpvs-border-blue-light"
                />
              </div>
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center space-x-4">
              {/* On Time Guaranteed Badge */}
              <div className="hidden lg:flex items-center space-x-1 kpvs-badge-success">
                <div className="w-2 h-2 kpvs-bg-success rounded-full"></div>
                <span>On Time Guaranteed</span>
              </div>

              {/* Country Selector */}
              <div className="hidden md:block">
                <Select defaultValue={activeCountries[0]?.code}>
                  <SelectTrigger className="w-[60px] border-none shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center space-x-2">
                          <img 
                            src={country.flag}
                            alt={country.fullName}
                            className="w-4 h-4"
                          />
                          <span>{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Authentication */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-2 kpvs-hover-blue-50 rounded-lg transition-colors">
                      <User className="h-5 w-5 kpvs-text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 kpvs-card kpvs-shadow-lg">
                    <div className="px-3 py-2 border-b kpvs-border-gray-200">
                      <p className="text-sm font-medium kpvs-text-gray-900">{user?.fullName}</p>
                      <p className="text-xs kpvs-text-gray-600">{user?.email}</p>
                    </div>
                    <DropdownMenuItem className="kpvs-hover-blue-50">
                      <Settings className="mr-2 h-4 w-4 kpvs-text-gray-600" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="kpvs-text-error hover:kpvs-bg-error-light">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 kpvs-hover-blue-50 rounded-lg transition-colors"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-5 w-5 kpvs-text-gray-700" />
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm" className="p-2 kpvs-hover-blue-50 rounded-lg transition-colors">
                    <Menu className="h-5 w-5 kpvs-text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] kpvs-bg-gray-50">
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 kpvs-text-gray-600 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search countries"
                        className="pl-10 pr-4 py-2 w-full kpvs-focus border-2 kpvs-border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center space-x-1 kpvs-badge-success justify-center">
                      <div className="w-2 h-2 kpvs-bg-success rounded-full"></div>
                      <span>On Time Guaranteed</span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;