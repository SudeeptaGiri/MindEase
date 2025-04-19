// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MindEase</h3>
            <p className="text-gray-600 text-sm">
              Supporting your mental wellness journey with care and understanding.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-teal-600 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="text-gray-600 hover:text-teal-600 text-sm">
                  Take Assessment
                </Link>
              </li>
              <li>
                <Link to="/helpline" className="text-gray-600 hover:text-teal-600 text-sm">
                  Get Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-teal-600 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-teal-600 text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-teal-600 text-sm"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                Emergency: 988
              </li>
              <li className="text-gray-600 text-sm">
                Email: support@mindease.com
              </li>
              <li className="text-gray-600 text-sm">
                Available 24/7
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MindEase. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-500 hover:text-teal-600 text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-teal-600 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;