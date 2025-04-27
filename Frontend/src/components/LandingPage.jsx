// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUserMd, FaSignInAlt } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                >
                  <span className="block">Take care of your</span>
                  <span className="block text-teal-600">mental health</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                >
                  Join our community of mental health professionals and individuals seeking support. 
                  Take assessments, track your progress, and connect with qualified professionals.
                </motion.p>
                
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10"
                    >
                      <FaUserPlus className="mr-2" />
                      Register as User
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/volunteer-register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 md:py-4 md:text-lg md:px-10"
                    >
                      <FaUserMd className="mr-2" />
                      Join as Volunteer
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 md:py-4 md:text-lg md:px-10"
                    >
                      <FaSignInAlt className="mr-2" />
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to manage mental health
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature items */}
              <FeatureItem
                title="Professional Assessment"
                description="Take validated mental health assessments and get instant results."
                icon="🎯"
              />
              <FeatureItem
                title="Track Progress"
                description="Monitor your mental health journey with detailed analytics and insights."
                icon="📈"
              />
              <FeatureItem
                title="Connect with Professionals"
                description="Get support from verified mental health professionals."
                icon="👥"
              />
              <FeatureItem
                title="Personalized Plans"
                description="Receive customized wellness plans based on your assessment results."
                icon="📋"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple steps to get started
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <StepItem
                number="1"
                title="Create an account"
                description="Sign up as a user or volunteer professional."
              />
              <StepItem
                number="2"
                title="Take assessment"
                description="Complete mental health assessments to understand your well-being."
              />
              <StepItem
                number="3"
                title="Get support"
                description="Connect with professionals and follow your wellness plan."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 MindEase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureItem = ({ title, description, icon }) => (
  <div className="relative">
    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
      {icon}
    </div>
    <div className="ml-16">
      <dt className="text-lg leading-6 font-medium text-gray-900">{title}</dt>
      <dd className="mt-2 text-base text-gray-500">{description}</dd>
    </div>
  </div>
);

const StepItem = ({ number, title, description }) => (
  <div className="relative">
    <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-teal-500 text-white text-xl font-bold">
      {number}
    </div>
    <div className="ml-16">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{description}</p>
    </div>
  </div>
);

export default LandingPage;