// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaChartLine, FaCalendarCheck, FaHandsHelping, FaUserMd, FaShieldAlt } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Mental Health Journey Starts Here
              </h1>
              <p className="text-xl mb-8 text-teal-100">
                MindEase provides personalized mental wellness assessments, recommendations, and support to help you on your path to better mental health.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-teal-700 font-medium rounded-lg hover:bg-teal-50 transition-colors shadow-md"
                >
                  Get Started
                </Link>
                <Link
                  to="/volunteer-register"
                  className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg border border-white hover:bg-teal-700 transition-colors shadow-md"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2">
              <img 
                src="/mental-health-illustration.svg" 
                alt="Mental Health Illustration" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Features That Support Your Journey</h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive tools designed to help you understand, track, and improve your mental wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-teal-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                <FaBrain className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Validated Assessments</h3>
              <p className="text-gray-600">
                Take clinically validated assessments like PHQ-9 for depression and GAD-7 for anxiety to understand your mental health status.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-teal-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                <FaChartLine className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your mental health journey with intuitive charts and visualizations that show your progress over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-teal-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                <FaCalendarCheck className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Tasks</h3>
              <p className="text-gray-600">
                Receive customized daily tasks and activities based on your assessment results to improve your mental wellness.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-teal-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                <FaHandsHelping className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Volunteer Support</h3>
              <p className="text-gray-600">
                Connect with certified volunteers who can provide guidance and support on your mental health journey.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-teal-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                <FaUserMd className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Resources</h3>
              <p className="text-gray-600">
                Find nearby mental health professionals and resources when you need more specialized support.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-teal-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-4">
                <FaShieldAlt className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy Focused</h3>
              <p className="text-gray-600">
                Your mental health data is private and secure. We prioritize your confidentiality at every step.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Section */}
      <div className="py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Make a Difference as a Volunteer
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Use your expertise to support others on their mental health journey. Join our network of certified volunteers.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Share your knowledge and experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Help users interpret their assessment results</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Guide users to appropriate professional resources</span>
                </li>
              </ul>
              <Link
                to="/volunteer-register"
                className="inline-block px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-md"
              >
                Apply to Volunteer
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/volunteer-illustration.svg" 
                alt="Volunteer Illustration" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600">
              Stories from people who have benefited from MindEase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Jane Doe</h4>
                  <p className="text-gray-500">User for 6 months</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "MindEase helped me understand my anxiety patterns and provided practical steps to manage it. The daily tasks have become an essential part of my routine."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                  MS
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Michael Smith</h4>
                  <p className="text-gray-500">User for 3 months</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The assessment tools gave me insights I never had before. Being able to track my progress over time has been incredibly motivating."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                  AR
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Amanda Rodriguez</h4>
                  <p className="text-gray-500">Volunteer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a mental health counselor, volunteering with MindEase has been rewarding. The platform makes it easy to connect with users and provide meaningful support."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Mental Wellness Journey Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-teal-100">
            Join thousands of users who are taking control of their mental health with MindEase's personalized approach.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-teal-700 font-medium rounded-lg hover:bg-teal-50 transition-colors shadow-md"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-teal-600 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;