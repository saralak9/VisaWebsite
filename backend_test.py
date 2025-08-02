#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Atlys USA Visa API
Tests all endpoints including health checks, authentication, countries, FAQs, and visa applications.
"""

import requests
import json
import sys
import os
from datetime import datetime, date
from typing import Dict, Any, Optional

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://22f86b8f-6485-4592-9598-006437a949fb.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.user_id = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details,
            'response': response_data
        })
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None, params: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{API_BASE_URL}{endpoint}"
        
        # Add authorization header if token exists
        if self.access_token and headers is None:
            headers = {}
        if self.access_token:
            headers = headers or {}
            headers['Authorization'] = f"Bearer {self.access_token}"
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == 'PUT':
                response = self.session.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers, timeout=30)
            else:
                return False, f"Unsupported method: {method}", 400
            
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            return response.status_code < 400, response_data, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0
    
    def test_health_endpoints(self):
        """Test health check endpoints"""
        print("🔍 Testing Health Check Endpoints...")
        
        # Test root endpoint
        success, data, status = self.make_request('GET', '/')
        if success and isinstance(data, dict) and data.get('status') == 'healthy':
            self.log_test("GET /api/", True, f"Status: {status}, Message: {data.get('message', '')}")
        else:
            self.log_test("GET /api/", False, f"Status: {status}", data)
        
        # Test health endpoint
        success, data, status = self.make_request('GET', '/health')
        if success and isinstance(data, dict) and data.get('status') == 'healthy':
            self.log_test("GET /api/health", True, f"Status: {status}, Database: {data.get('database', '')}")
        else:
            self.log_test("GET /api/health", False, f"Status: {status}", data)
    
    def test_countries_api(self):
        """Test countries API endpoints"""
        print("🌍 Testing Countries API...")
        
        # Test get all countries
        success, data, status = self.make_request('GET', '/countries')
        if success and isinstance(data, dict) and data.get('success') and isinstance(data.get('data'), list):
            countries = data['data']
            self.log_test("GET /api/countries", True, f"Retrieved {len(countries)} countries")
            
            # Test specific country if we have data
            if countries:
                country_code = countries[0].get('code')
                if country_code:
                    success2, data2, status2 = self.make_request('GET', f'/countries/{country_code}')
                    if success2 and isinstance(data2, dict) and data2.get('success'):
                        self.log_test(f"GET /api/countries/{country_code}", True, f"Retrieved country: {data2['data'].get('name', '')}")
                    else:
                        self.log_test(f"GET /api/countries/{country_code}", False, f"Status: {status2}", data2)
        else:
            self.log_test("GET /api/countries", False, f"Status: {status}", data)
    
    def test_faqs_api(self):
        """Test FAQs API endpoints"""
        print("❓ Testing FAQs API...")
        
        # Test get all FAQs
        success, data, status = self.make_request('GET', '/faqs')
        if success and isinstance(data, dict) and data.get('success') and isinstance(data.get('data'), list):
            faqs = data['data']
            self.log_test("GET /api/faqs", True, f"Retrieved {len(faqs)} FAQs")
        else:
            self.log_test("GET /api/faqs", False, f"Status: {status}", data)
        
        # Test FAQ search
        success, data, status = self.make_request('GET', '/faqs/search', params={'q': 'visa'})
        if success and isinstance(data, dict) and data.get('success') and isinstance(data.get('data'), list):
            search_results = data['data']
            self.log_test("GET /api/faqs/search?q=visa", True, f"Found {len(search_results)} FAQs matching 'visa'")
        else:
            self.log_test("GET /api/faqs/search?q=visa", False, f"Status: {status}", data)
    
    def test_authentication(self):
        """Test authentication endpoints"""
        print("🔐 Testing Authentication...")
        
        # Test user registration
        register_data = {
            "fullName": "Sarah Johnson",
            "email": "sarah.johnson@example.com",
            "password": "SecurePass123",
            "phone": "+1-555-0123",
            "citizenship": "United States"
        }
        
        success, data, status = self.make_request('POST', '/auth/register', register_data)
        if success and isinstance(data, dict) and data.get('success'):
            self.access_token = data['data'].get('access_token')
            self.user_id = data['data'].get('user_id')
            self.log_test("POST /api/auth/register", True, f"User registered with ID: {self.user_id}")
        else:
            # Registration failed - likely user already exists, try login instead
            if status == 400 and 'already registered' in str(data.get('detail', '')):
                self.log_test("POST /api/auth/register", True, "User already exists (expected behavior)")
            else:
                self.log_test("POST /api/auth/register", False, f"Status: {status}", data)
            
            # If registration failed, try login with existing user
            login_data = {
                "email": "sarah.johnson@example.com",
                "password": "SecurePass123"
            }
            
            success, data, status = self.make_request('POST', '/auth/login', login_data)
            if success and isinstance(data, dict) and data.get('success'):
                self.access_token = data['data'].get('access_token')
                self.user_id = data['data'].get('user_id')
                self.log_test("POST /api/auth/login (fallback)", True, f"User logged in with ID: {self.user_id}")
            else:
                self.log_test("POST /api/auth/login (fallback)", False, f"Status: {status}", data)
        
        # Test login with the same credentials
        if not self.access_token:
            login_data = {
                "email": "sarah.johnson@example.com",
                "password": "SecurePass123"
            }
            
            success, data, status = self.make_request('POST', '/auth/login', login_data)
            if success and isinstance(data, dict) and data.get('success'):
                self.access_token = data['data'].get('access_token')
                self.user_id = data['data'].get('user_id')
                self.log_test("POST /api/auth/login", True, f"User logged in with ID: {self.user_id}")
            else:
                self.log_test("POST /api/auth/login", False, f"Status: {status}", data)
    
    def test_visa_applications(self):
        """Test visa applications endpoints"""
        print("📋 Testing Visa Applications...")
        
        if not self.access_token:
            self.log_test("Visa Applications", False, "No access token available - skipping visa application tests")
            return
        
        # Test create visa application
        application_data = {
            "visaType": {
                "id": "tourist",
                "name": "Tourist Visa",
                "duration": "90 days",
                "validity": "10 years",
                "price": 160.0
            },
            "personalInfo": {
                "fullName": "Sarah Johnson",
                "email": "sarah.johnson@example.com",
                "phone": "+1-555-0123",
                "citizenship": "United States",
                "placeOfBirth": "New York, NY",
                "gender": "Female"
            },
            "travelDetails": {
                "purpose": "Tourism",
                "duration": 30,
                "accommodation": "Hotel Booking Confirmed",
                "previousVisits": False
            },
            "passportInfo": {
                "number": "123456789",
                "issuingCountry": "United States"
            }
        }
        
        success, data, status = self.make_request('POST', '/visa-applications', application_data)
        application_id = None
        if success and isinstance(data, dict) and data.get('success'):
            application_id = data['data'].get('application_id')
            app_number = data['data'].get('application_number')
            self.log_test("POST /api/visa-applications", True, f"Application created: {app_number}")
        else:
            self.log_test("POST /api/visa-applications", False, f"Status: {status}", data)
        
        # Test get user applications
        success, data, status = self.make_request('GET', '/visa-applications')
        if success and isinstance(data, dict) and data.get('success') and isinstance(data.get('data'), list):
            applications = data['data']
            self.log_test("GET /api/visa-applications", True, f"Retrieved {len(applications)} applications")
        else:
            self.log_test("GET /api/visa-applications", False, f"Status: {status}", data)
        
        # Test get specific application
        if application_id:
            success, data, status = self.make_request('GET', f'/visa-applications/{application_id}')
            if success and isinstance(data, dict) and data.get('success'):
                self.log_test(f"GET /api/visa-applications/{application_id}", True, "Application retrieved successfully")
            else:
                self.log_test(f"GET /api/visa-applications/{application_id}", False, f"Status: {status}", data)
    
    def test_error_handling(self):
        """Test error handling for protected endpoints"""
        print("🚫 Testing Error Handling...")
        
        # Test protected endpoint without token
        old_token = self.access_token
        self.access_token = None
        
        success, data, status = self.make_request('GET', '/visa-applications')
        if not success and status in [401, 403]:
            self.log_test("Protected endpoint without token", True, f"Correctly returned {status} (Unauthorized/Forbidden)")
        else:
            self.log_test("Protected endpoint without token", False, f"Expected 401/403, got {status}", data)
        
        # Test with invalid token
        self.access_token = "invalid_token_12345"
        success, data, status = self.make_request('GET', '/visa-applications')
        if not success and status == 401:
            self.log_test("Protected endpoint with invalid token", True, "Correctly returned 401 Unauthorized")
        else:
            self.log_test("Protected endpoint with invalid token", False, f"Expected 401, got {status}", data)
        
        # Restore token
        self.access_token = old_token
        
        # Test invalid country code
        success, data, status = self.make_request('GET', '/countries/INVALID')
        if not success and status == 404:
            self.log_test("Invalid country code", True, "Correctly returned 404 Not Found")
        else:
            self.log_test("Invalid country code", False, f"Expected 404, got {status}", data)
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Atlys USA Visa API Backend Tests")
        print(f"🌐 Testing against: {API_BASE_URL}")
        print("=" * 60)
        
        # Run test suites
        self.test_health_endpoints()
        self.test_countries_api()
        self.test_faqs_api()
        self.test_authentication()
        self.test_visa_applications()
        self.test_error_handling()
        
        # Print summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)
        return failed_tests == 0

def main():
    """Main test execution"""
    tester = APITester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All tests passed! Backend API is working correctly.")
        sys.exit(0)
    else:
        print("⚠️  Some tests failed. Check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()