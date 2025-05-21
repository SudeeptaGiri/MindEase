import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  FaBrain, 
  FaChartLine, 
  FaCalendarCheck, 
  FaHandsHelping, 
  FaUserMd, 
  FaShieldAlt,
  FaArrowRight,
  FaQuoteLeft,
  FaStar,
  FaCheck,
  FaHeartbeat,
  FaLightbulb,
  FaUsers,
  FaMedal,
  FaLock
} from 'react-icons/fa';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" 
  }
};

// Section component with animations
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stats data
const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500+', label: 'Mental Health Professionals' },
  { value: '92%', label: 'User Satisfaction' },
  { value: '24/7', label: 'Support Available' }
];

// How it works steps
const steps = [
  {
    title: 'Take an Assessment',
    description: 'Complete our scientifically validated mental health assessments to understand your current state.',
    icon: <FaBrain className="h-6 w-6 text-white" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Get Personalized Insights',
    description: 'Receive detailed analysis of your mental health with actionable recommendations.',
    icon: <FaLightbulb className="h-6 w-6 text-white" />,
    color: 'from-teal-500 to-teal-600'
  },
  {
    title: 'Follow Your Plan',
    description: 'Complete daily activities and exercises designed specifically for your needs.',
    icon: <FaCalendarCheck className="h-6 w-6 text-white" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Track Your Progress',
    description: 'Monitor your improvement over time with detailed analytics and insights.',
    icon: <FaChartLine className="h-6 w-6 text-white" />,
    color: 'from-green-500 to-green-600'
  }
];

// Testimonials data
const testimonials = [
  {
    name: 'Jane Doe',
    role: 'User for 6 months',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    content: "MindEase helped me understand my anxiety patterns and provided practical steps to manage it. The daily tasks have become an essential part of my routine.",
    initials: 'JD',
    rating: 5
  },
  {
    name: 'Michael Smith',
    role: 'User for 3 months',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    content: "The assessment tools gave me insights I never had before. Being able to track my progress over time has been incredibly motivating.",
    initials: 'MS',
    rating: 5
  },
  {
    name: 'Amanda Rodriguez',
    role: 'Volunteer',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: "As a mental health counselor, volunteering with MindEase has been rewarding. The platform makes it easy to connect with users and provide meaningful support.",
    initials: 'AR',
    rating: 5
  }
];

// Features data
const features = [
  {
    icon: <FaBrain className="h-6 w-6 text-teal-600" />,
    title: 'Validated Assessments',
    description: 'Take clinically validated assessments like PHQ-9 for depression and GAD-7 for anxiety to understand your mental health status.'
  },
  {
    icon: <FaChartLine className="h-6 w-6 text-teal-600" />,
    title: 'Progress Tracking',
    description: 'Monitor your mental health journey with intuitive charts and visualizations that show your progress over time.'
  },
  {
    icon: <FaCalendarCheck className="h-6 w-6 text-teal-600" />,
    title: 'Personalized Tasks',
    description: 'Receive customized daily tasks and activities based on your assessment results to improve your mental wellness.'
  },
  {
    icon: <FaHandsHelping className="h-6 w-6 text-teal-600" />,
    title: 'Volunteer Support',
    description: 'Connect with certified volunteers who can provide guidance and support on your mental health journey.'
  },
  {
    icon: <FaUserMd className="h-6 w-6 text-teal-600" />,
    title: 'Professional Resources',
    description: 'Find nearby mental health professionals and resources when you need more specialized support.'
  },
  {
    icon: <FaShieldAlt className="h-6 w-6 text-teal-600" />,
    title: 'Privacy Focused',
    description: 'Your mental health data is private and secure. We prioritize your confidentiality at every step.'
  }
];



// For the volunteer illustration
const VolunteerIllustration = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" className="w-full h-auto rounded-2xl shadow-lg z-10">
    <defs>
      <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B2F5EA" />
        <stop offset="100%" stopColor="#90CDF4" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#4FD1C5" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#4FD1C5" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Background */}
    <rect x="0" y="0" width="800" height="500" fill="url(#bg-gradient)" rx="15" />
    <circle cx="400" cy="250" r="200" fill="url(#glow)" opacity="0.7">
      <animate attributeName="r" values="200;220;200" dur="10s" repeatCount="indefinite" />
    </circle>
    
    {/* Connection lines */}
    <g id="connections" stroke="#2C7A7B" strokeWidth="1.5" opacity="0.6">
      <line x1="300" y1="250" x2="380" y2="250" strokeDasharray="5,5">
        <animate attributeName="x2" values="380;400;380" dur="8s" repeatCount="indefinite" />
      </line>
      <line x1="500" y1="250" x2="420" y2="250" strokeDasharray="5,5">
        <animate attributeName="x2" values="420;400;420" dur="8s" repeatCount="indefinite" />
      </line>
      <line x1="400" y1="150" x2="400" y2="230" strokeDasharray="5,5">
        <animate attributeName="y2" values="230;250;230" dur="8s" repeatCount="indefinite" />
      </line>
      <line x1="400" y1="350" x2="400" y2="270" strokeDasharray="5,5">
        <animate attributeName="y2" values="270;250;270" dur="8s" repeatCount="indefinite" />
      </line>
    </g>
    
    {/* People icons */}
    <g id="volunteer" transform="translate(400, 250)">
      <circle cx="0" cy="0" r="40" fill="#4FD1C5" />
      <circle cx="0" cy="-15" r="15" fill="#E6FFFA" />
      <path d="M-20,5 a20,20 0 0 1 40,0 v10 a10,10 0 0 1 -40,0 z" fill="#E6FFFA" />
      <text x="0" y="50" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#E6FFFA" textAnchor="middle">Volunteer</text>
      <animate attributeName="opacity" values="1;0.9;1" dur="3s" repeatCount="indefinite" />
    </g>
    
    <g id="user1" transform="translate(300, 250)">
      <circle cx="0" cy="0" r="30" fill="#90CDF4" />
      <circle cx="0" cy="-12" r="12" fill="#EBF8FF" />
      <path d="M-15,3 a15,15 0 0 1 30,0 v8 a8,8 0 0 1 -30,0 z" fill="#EBF8FF" />
      <text x="0" y="40" fontFamily="Arial" fontSize="12" fill="#EBF8FF" textAnchor="middle">User</text>
      <animateTransform attributeName="transform" type="translate" values="300,250; 310,250; 300,250" dur="5s" repeatCount="indefinite" />
    </g>
    
    <g id="user2" transform="translate(500, 250)">
      <circle cx="0" cy="0" r="30" fill="#B794F4" />
      <circle cx="0" cy="-12" r="12" fill="#FAF5FF" />
      <path d="M-15,3 a15,15 0 0 1 30,0 v8 a8,8 0 0 1 -30,0 z" fill="#FAF5FF" />
      <text x="0" y="40" fontFamily="Arial" fontSize="12" fill="#FAF5FF" textAnchor="middle">User</text>
      <animateTransform attributeName="transform" type="translate" values="500,250; 490,250; 500,250" dur="5s" repeatCount="indefinite" />
    </g>
    
    <g id="user3" transform="translate(400, 150)">
      <circle cx="0" cy="0" r="30" fill="#F687B3" />
      <circle cx="0" cy="-12" r="12" fill="#FFF5F7" />
      <path d="M-15,3 a15,15 0 0 1 30,0 v8 a8,8 0 0 1 -30,0 z" fill="#FFF5F7" />
      <text x="0" y="40" fontFamily="Arial" fontSize="12" fill="#FFF5F7" textAnchor="middle">User</text>
      <animateTransform attributeName="transform" type="translate" values="400,150; 400,160; 400,150" dur="5s" repeatCount="indefinite" />
    </g>
    
    <g id="user4" transform="translate(400, 350)">
      <circle cx="0" cy="0" r="30" fill="#68D391" />
      <circle cx="0" cy="-12" r="12" fill="#F0FFF4" />
      <path d="M-15,3 a15,15 0 0 1 30,0 v8 a8,8 0 0 1 -30,0 z" fill="#F0FFF4" />
      <text x="0" y="40" fontFamily="Arial" fontSize="12" fill="#F0FFF4" textAnchor="middle">User</text>
      <animateTransform attributeName="transform" type="translate" values="400,350; 400,340; 400,350" dur="5s" repeatCount="indefinite" />
    </g>
    
    {/* Support icons */}
    <g id="support-icons">
      <g transform="translate(200, 150)">
        <circle cx="0" cy="0" r="25" fill="#E6FFFA" opacity="0.8" />
        <path d="M-10,-5 a10,10 0 0 1 20,0 v2 a2,2 0 0 1 -20,0 z M-5,10 h10 M0,-10 v-5" stroke="#319795" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <animateTransform attributeName="transform" type="translate" values="200,150; 210,145; 200,150" dur="7s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(600, 150)">
        <circle cx="0" cy="0" r="25" fill="#E6FFFA" opacity="0.8" />
        <path d="M-10,0 h20 M0,-10 v20" stroke="#319795" strokeWidth="3" fill="none" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" values="600,150; 590,145; 600,150" dur="7s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(200, 350)">
        <circle cx="0" cy="0" r="25" fill="#E6FFFA" opacity="0.8" />
        <path d="M-8,-8 l16,16 M-8,8 l16,-16" stroke="#319795" strokeWidth="3" fill="none" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" values="200,350; 210,355; 200,350" dur="7s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(600, 350)">
        <circle cx="0" cy="0" r="25" fill="#E6FFFA" opacity="0.8" />
        <path d="M0,-10 l-10,15 h20 z" fill="#319795" />
        <animateTransform attributeName="transform" type="translate" values="600,350; 590,355; 600,350" dur="7s" repeatCount="indefinite" />
      </g>
    </g>
    
    {/* Message bubbles */}
    <g id="message-bubbles">
      <g transform="translate(330, 190)">
        <path d="M0,0 h60 a10,10 0 0 1 10,10 v20 a10,10 0 0 1 -10,10 h-10 l-5,10 l-5,-10 h-40 a10,10 0 0 1 -10,-10 v-20 a10,10 0 0 1 10,-10 z" fill="#EBF8FF" stroke="#3182CE" strokeWidth="1" />
        <text x="30" y="25" fontFamily="Arial" fontSize="10" fill="#3182CE" textAnchor="middle">Need help</text>
        <animate attributeName="opacity" values="0;1;0" dur="10s" repeatCount="indefinite" begin="0s" />
      </g>
      
      <g transform="translate(470, 190)">
        <path d="M0,0 h60 a10,10 0 0 1 10,10 v20 a10,10 0 0 1 -10,10 h-40 l-5,10 l-5,-10 h-10 a10,10 0 0 1 -10,-10 v-20 a10,10 0 0 1 10,-10 z" fill="#E6FFFA" stroke="#319795" strokeWidth="1" />
        <text x="30" y="25" fontFamily="Arial" fontSize="10" fill="#319795" textAnchor="middle">I'm here!</text>
        <animate attributeName="opacity" values="0;0;1;1;0" dur="10s" repeatCount="indefinite" begin="2s" />
      </g>
      
      <g transform="translate(330, 310)">
        <path d="M0,0 h80 a10,10 0 0 1 10,10 v20 a10,10 0 0 1 -10,10 h-10 l-5,10 l-5,-10 h-60 a10,10 0 0 1 -10,-10 v-20 a10,10 0 0 1 10,-10 z" fill="#FAF5FF" stroke="#6B46C1" strokeWidth="1" />
        <text x="40" y="25" fontFamily="Arial" fontSize="10" fill="#6B46C1" textAnchor="middle">How do I cope?</text>
        <animate attributeName="opacity" values="0;0;0;1;1;0" dur="15s" repeatCount="indefinite" begin="5s" />
      </g>
      
      <g transform="translate(470, 310)">
        <path d="M0,0 h80 a10,10 0 0 1 10,10 v30 a10,10 0 0 1 -10,10 h-60 l-5,10 l-5,-10 h-10 a10,10 0 0 1 -10,-10 v-30 a10,10 0 0 1 10,-10 z" fill="#E6FFFA" stroke="#319795" strokeWidth="1" />
        <text x="40" y="20" fontFamily="Arial" fontSize="10" fill="#319795" textAnchor="middle">Try deep</text>
        <text x="40" y="35" fontFamily="Arial" fontSize="10" fill="#319795" textAnchor="middle">breathing first</text>
        <animate attributeName="opacity" values="0;0;0;0;1;1;0" dur="15s" repeatCount="indefinite" begin="8s" />
      </g>
    </g>
    
    {/* Floating icons */}
    <g id="floating-icons">
      <g transform="translate(150, 100)">
        <circle cx="0" cy="0" r="15" fill="#E6FFFA" stroke="#319795" strokeWidth="1" />
        <path d="M-5,-5 a5,10 0 0 1 10,0 a5,5 0 0 1 -10,0 M-5,5 a10,5 0 0 0 10,0" stroke="#319795" strokeWidth="2" fill="none" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" values="150,100; 160,90; 150,100" dur="8s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(650, 100)">
        <circle cx="0" cy="0" r="15" fill="#EBF8FF" stroke="#3182CE" strokeWidth="1" />
        <path d="M-5,-5 l3,3 l7,-7" stroke="#3182CE" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <animateTransform attributeName="transform" type="translate" values="650,100; 640,90; 650,100" dur="8s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(150, 400)">
        <circle cx="0" cy="0" r="15" fill="#FFF5F7" stroke="#D53F8C" strokeWidth="1" />
        <path d="M-5,0 a5,5 0 0 1 10,0 a5,5 0 0 1 -10,0" stroke="#D53F8C" strokeWidth="2" fill="none" />
        <animateTransform attributeName="transform" type="translate" values="150,400; 160,410; 150,400" dur="8s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(650, 400)">
        <circle cx="0" cy="0" r="15" fill="#F0FFF4" stroke="#38A169" strokeWidth="1" />
        <path d="M-5,-5 l10,10 M-5,5 l10,-10" stroke="#38A169" strokeWidth="2" fill="none" strokeLinecap="round" />
        <animateTransform attributeName="transform" type="translate" values="650,400; 640,410; 650,400" dur="8s" repeatCount="indefinite" />
      </g>
    </g>
    
    {/* Title */}
    <text x="400" y="470" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="#2C7A7B" textAnchor="middle">Connecting People Through Support</text>
  </svg>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with animated gradient background */}
      <div className="relative bg-gradient-to-r from-teal-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="md:flex md:items-center md:justify-between"
          >
            <div className="md:w-1/2 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full mb-4">
                  Mental Health Support Platform
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Your Mental Health Journey <span className="bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">Starts Here</span>
                </h1>
                <p className="text-xl mb-8 text-blue-50 leading-relaxed max-w-lg">
                  MindEase provides personalized mental wellness assessments, recommendations, and support to help you on your path to better mental health.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/register"
                      className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md flex items-center"
                    >
                      Get Started <FaArrowRight className="ml-2" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/volunteer-register"
                      className="px-6 py-3 bg-blue-600/30 backdrop-blur-sm text-white font-medium rounded-lg border border-white/30 hover:bg-blue-600/50 transition-colors shadow-md"
                    >
                      Become a Volunteer
                    </Link>
                  </motion.div>
                </div>
                
                <div className="mt-15">
  
</div>
              </motion.div>
            </div>
            <div className="hidden md:block md:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative z-10"
              >
                <motion.div animate={pulseAnimation}>
    
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" className="w-full h-auto max-w-md mx-auto drop-shadow-2xl">

  <circle cx="400" cy="300" r="200" fill="#EDF2F7" opacity="0.5">
    <animate attributeName="r" values="200;220;200" dur="10s" repeatCount="indefinite" />
  </circle>
  <circle cx="400" cy="300" r="150" fill="#E2E8F0" opacity="0.5">
    <animate attributeName="r" values="150;170;150" dur="8s" repeatCount="indefinite" />
  </circle>

  <g id="brain">
    <path d="M400,160 C520,160 550,240 550,300 C550,360 520,440 400,440 C280,440 250,360 250,300 C250,240 280,160 400,160 Z" 
          fill="#B2F5EA" stroke="#319795" stroke-width="3" opacity="0.9">
      <animate attributeName="d" 
               values="M400,160 C520,160 550,240 550,300 C550,360 520,440 400,440 C280,440 250,360 250,300 C250,240 280,160 400,160 Z;
                      M400,170 C530,170 560,245 560,300 C560,355 530,430 400,430 C270,430 240,355 240,300 C240,245 270,170 400,170 Z;
                      M400,160 C520,160 550,240 550,300 C550,360 520,440 400,440 C280,440 250,360 250,300 C250,240 280,160 400,160 Z" 
               dur="10s" repeatCount="indefinite" />
    </path>
    

    <path d="M400,180 C450,180 480,230 480,270 C480,310 450,360 400,360 C350,360 320,310 320,270 C320,230 350,180 400,180 Z" 
          fill="#81E6D9" stroke="#2C7A7B" stroke-width="2">
      <animate attributeName="d" 
               values="M400,180 C450,180 480,230 480,270 C480,310 450,360 400,360 C350,360 320,310 320,270 C320,230 350,180 400,180 Z;
                      M400,190 C455,190 485,235 485,270 C485,305 455,350 400,350 C345,350 315,305 315,270 C315,235 345,190 400,190 Z;
                      M400,180 C450,180 480,230 480,270 C480,310 450,360 400,360 C350,360 320,310 320,270 C320,230 350,180 400,180 Z" 
               dur="8s" repeatCount="indefinite" />
    </path>

    <path d="M320,270 C290,270 260,260 250,290 C240,320 270,340 290,330 C310,320 320,300 320,270 Z" 
          fill="#4FD1C5" stroke="#2C7A7B" stroke-width="2">
      <animate attributeName="d" 
               values="M320,270 C290,270 260,260 250,290 C240,320 270,340 290,330 C310,320 320,300 320,270 Z;
                      M315,270 C285,270 255,260 245,290 C235,320 265,345 285,335 C305,325 315,300 315,270 Z;
                      M320,270 C290,270 260,260 250,290 C240,320 270,340 290,330 C310,320 320,300 320,270 Z" 
               dur="6s" repeatCount="indefinite" />
    </path>
    

    <path d="M480,270 C510,270 540,260 550,290 C560,320 530,340 510,330 C490,320 480,300 480,270 Z" 
          fill="#4FD1C5" stroke="#2C7A7B" stroke-width="2">
      <animate attributeName="d" 
               values="M480,270 C510,270 540,260 550,290 C560,320 530,340 510,330 C490,320 480,300 480,270 Z;
                      M485,270 C515,270 545,260 555,290 C565,320 535,345 515,335 C495,325 485,300 485,270 Z;
                      M480,270 C510,270 540,260 550,290 C560,320 530,340 510,330 C490,320 480,300 480,270 Z" 
               dur="7s" repeatCount="indefinite" />
    </path>

    <path d="M400,180 C400,150 430,130 460,140 C490,150 480,180 460,190 C440,200 420,190 400,180 Z" 
          fill="#38B2AC" stroke="#2C7A7B" stroke-width="2">
      <animate attributeName="d" 
               values="M400,180 C400,150 430,130 460,140 C490,150 480,180 460,190 C440,200 420,190 400,180 Z;
                      M400,190 C400,160 435,135 465,145 C495,155 485,185 465,195 C445,205 425,195 400,190 Z;
                      M400,180 C400,150 430,130 460,140 C490,150 480,180 460,190 C440,200 420,190 400,180 Z" 
               dur="9s" repeatCount="indefinite" />
    </path>
    
    <path d="M400,180 C400,150 370,130 340,140 C310,150 320,180 340,190 C360,200 380,190 400,180 Z" 
          fill="#38B2AC" stroke="#2C7A7B" stroke-width="2">
      <animate attributeName="d" 
               values="M400,180 C400,150 370,130 340,140 C310,150 320,180 340,190 C360,200 380,190 400,180 Z;
                      M400,190 C400,160 365,135 335,145 C305,155 315,185 335,195 C355,205 375,195 400,190 Z;
                      M400,180 C400,150 370,130 340,140 C310,150 320,180 340,190 C360,200 380,190 400,180 Z" 
               dur="8s" repeatCount="indefinite" />
    </path>
    

    <path d="M400,360 C400,390 430,410 460,400 C490,390 480,360 460,350 C440,340 420,350 400,360 Z" 
          fill="#319795" stroke="#2C7A7B" stroke-width="2">
      <animate attributeName="d" 
               values="M400,360 C400,390 430,410 460,400 C490,390 480,360 460,350 C440,340 420,350 400,360 Z;
                      M400,350 C400,380 435,405 465,395 C495,385 485,355 465,345 C445,335 425,345 400,350 Z;
                      M400,360 C400,390 430,410 460,400 C490,390 480,360 460,350 C440,340 420,350 400,360 Z" 
               dur="7s" repeatCount="indefinite" />
    </path>
    
    <path d="M400,360 C400,390 370,410 340,400 C310,390 320,360 340,350 C360,340 380,350 400,360 Z" 
          fill="#319795" stroke="#2C7A7B" stroke-width="2">
      <animate attributeName="d" 
               values="M400,360 C400,390 370,410 340,400 C310,390 320,360 340,350 C360,340 380,350 400,360 Z;
                      M400,350 C400,380 365,405 335,395 C305,385 315,355 335,345 C355,335 375,345 400,350 Z;
                      M400,360 C400,390 370,410 340,400 C310,390 320,360 340,350 C360,340 380,350 400,360 Z" 
               dur="8s" repeatCount="indefinite" />
    </path>
  </g>
  

  <circle cx="400" cy="300" r="10" fill="#3182CE" opacity="0.8">
    <animate attributeName="r" values="10;60;10" dur="4s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0.8;0;0.8" dur="4s" repeatCount="indefinite" />
  </circle>
  
  <g id="connections" stroke="#2C7A7B" stroke-width="1.5" opacity="0.6">
    <line x1="340" y1="230" x2="380" y2="270" stroke-dasharray="5,5">
      <animate attributeName="x1" values="340;345;340" dur="8s" repeatCount="indefinite" />
      <animate attributeName="y1" values="230;235;230" dur="8s" repeatCount="indefinite" />
    </line>
    <line x1="460" y1="230" x2="420" y2="270" stroke-dasharray="5,5">
      <animate attributeName="x1" values="460;455;460" dur="8s" repeatCount="indefinite" />
      <animate attributeName="y1" values="230;235;230" dur="8s" repeatCount="indefinite" />
    </line>
    <line x1="340" y1="370" x2="380" y2="330" stroke-dasharray="5,5">
      <animate attributeName="x1" values="340;345;340" dur="8s" repeatCount="indefinite" />
      <animate attributeName="y1" values="370;365;370" dur="8s" repeatCount="indefinite" />
    </line>
    <line x1="460" y1="370" x2="420" y2="330" stroke-dasharray="5,5">
      <animate attributeName="x1" values="460;455;460" dur="8s" repeatCount="indefinite" />
      <animate attributeName="y1" values="370;365;370" dur="8s" repeatCount="indefinite" />
    </line>
  </g>
  
  <g id="thoughts">
    <circle cx="300" cy="200" r="15" fill="#3182CE" opacity="0.7">
      <animate attributeName="cy" values="200;190;200" dur="5s" repeatCount="indefinite" />
    </circle>
    <circle cx="500" cy="200" r="15" fill="#3182CE" opacity="0.7">
      <animate attributeName="cy" values="200;210;200" dur="6s" repeatCount="indefinite" />
    </circle>
    <circle cx="300" cy="400" r="15" fill="#3182CE" opacity="0.7">
      <animate attributeName="cy" values="400;410;400" dur="5s" repeatCount="indefinite" />
    </circle>
    <circle cx="500" cy="400" r="15" fill="#3182CE" opacity="0.7">
      <animate attributeName="cy" values="400;390;400" dur="6s" repeatCount="indefinite" />
    </circle>
    
    <circle cx="330" cy="220" r="8" fill="#3182CE" opacity="0.5">
      <animate attributeName="cy" values="220;215;220" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="470" cy="220" r="8" fill="#3182CE" opacity="0.5">
      <animate attributeName="cy" values="220;225;220" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="330" cy="380" r="8" fill="#3182CE" opacity="0.5">
      <animate attributeName="cy" values="380;385;380" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="470" cy="380" r="8" fill="#3182CE" opacity="0.5">
      <animate attributeName="cy" values="380;375;380" dur="4s" repeatCount="indefinite" />
    </circle>
  </g>
  
 
  <g id="heart-pulse" transform="translate(150, 250)">
    <path d="M25,10 C25,10 0,10 0,30 C0,50 25,70 25,70 C25,70 50,50 50,30 C50,10 25,10 25,10 Z" 
          fill="#FC8181" stroke="#E53E3E" stroke-width="2">
      <animate attributeName="d" 
               values="M25,10 C25,10 0,10 0,30 C0,50 25,70 25,70 C25,70 50,50 50,30 C50,10 25,10 25,10 Z;
                      M25,15 C25,15 5,15 5,35 C5,55 25,65 25,65 C25,65 45,55 45,35 C45,15 25,15 25,15 Z;
                      M25,10 C25,10 0,10 0,30 C0,50 25,70 25,70 C25,70 50,50 50,30 C50,10 25,10 25,10 Z" 
               dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M10,30 L20,30 L25,15 L30,45 L35,30 L45,30" fill="none" stroke="#E53E3E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <animate attributeName="d" 
               values="M10,30 L20,30 L25,15 L30,45 L35,30 L45,30;
                      M10,30 L20,30 L25,20 L30,40 L35,30 L45,30;
                      M10,30 L20,30 L25,15 L30,45 L35,30 L45,30" 
               dur="1.5s" repeatCount="indefinite" />
    </path>
  </g>

  <g id="meditation" transform="translate(600, 250)">
    <circle cx="25" cy="25" r="23" fill="#B2F5EA" stroke="#319795" stroke-width="2">
      <animate attributeName="r" values="23;25;23" dur="5s" repeatCount="indefinite" />
    </circle>
    <path d="M25,15 C15,15 10,25 10,30 C10,35 15,45 25,45 C35,45 40,35 40,30 C40,25 35,15 25,15 Z" fill="#4FD1C5">
      <animate attributeName="d" 
               values="M25,15 C15,15 10,25 10,30 C10,35 15,45 25,45 C35,45 40,35 40,30 C40,25 35,15 25,15 Z;
                      M25,17 C17,17 12,25 12,30 C12,35 17,43 25,43 C33,43 38,35 38,30 C38,25 33,17 25,17 Z;
                      M25,15 C15,15 10,25 10,30 C10,35 15,45 25,45 C35,45 40,35 40,30 C40,25 35,15 25,15 Z" 
               dur="5s" repeatCount="indefinite" />
    </path>
    <path d="M25,22 C18,22 15,28 25,28 C35,28 32,22 25,22 Z" fill="#319795">
      <animate attributeName="d" 
               values="M25,22 C18,22 15,28 25,28 C35,28 32,22 25,22 Z;
                      M25,23 C19,23 17,28 25,28 C33,28 31,23 25,23 Z;
                      M25,22 C18,22 15,28 25,28 C35,28 32,22 25,22 Z" 
               dur="5s" repeatCount="indefinite" />
    </path>
    <path d="M15,37 C15,37 25,40 35,37" fill="none" stroke="#319795" stroke-width="2" stroke-linecap="round">
      <animate attributeName="d" 
               values="M15,37 C15,37 25,40 35,37;
                      M15,36 C15,36 25,38 35,36;
                      M15,37 C15,37 25,40 35,37" 
               dur="5s" repeatCount="indefinite" />
    </path>
    <path d="M15,32 C15,32 18,35 20,35 C22,35 22,32 25,32 C28,32 28,35 30,35 C32,35 35,32 35,32" fill="none" stroke="#319795" stroke-width="1.5" stroke-linecap="round">
      <animate attributeName="d" 
               values="M15,32 C15,32 18,35 20,35 C22,35 22,32 25,32 C28,32 28,35 30,35 C32,35 35,32 35,32;
                      M15,33 C15,33 18,35 20,35 C22,35 22,33 25,33 C28,33 28,35 30,35 C32,35 35,33 35,33;
                      M15,32 C15,32 18,35 20,35 C22,35 22,32 25,32 C28,32 28,35 30,35 C32,35 35,32 35,32" 
               dur="5s" repeatCount="indefinite" />
    </path>
  </g>

  <g id="mindfulness-bubble" transform="translate(650, 100)">
    <rect x="0" y="0" width="100" height="40" rx="20" ry="20" fill="#EBF8FF" stroke="#3182CE" stroke-width="2">
      <animate attributeName="y" values="0;-5;0" dur="5s" repeatCount="indefinite" />
    </rect>
    <text x="50" y="25" font-family="Arial" font-size="12" fill="#3182CE" text-anchor="middle" alignment-baseline="middle">Mindfulness</text>
  </g>
  
  <g id="wellness-bubble" transform="translate(150, 100)">
    <rect x="0" y="0" width="80" height="40" rx="20" ry="20" fill="#E6FFFA" stroke="#319795" stroke-width="2">
      <animate attributeName="y" values="0;5;0" dur="6s" repeatCount="indefinite" />
    </rect>
    <text x="40" y="25" font-family="Arial" font-size="12" fill="#319795" text-anchor="middle" alignment-baseline="middle">Wellness</text>
  </g>
  
  <g id="support-bubble" transform="translate(150, 450)">
    <rect x="0" y="0" width="80" height="40" rx="20" ry="20" fill="#F0FFF4" stroke="#38A169" stroke-width="2">
      <animate attributeName="y" values="0;-5;0" dur="5.5s" repeatCount="indefinite" />
    </rect>
    <text x="40" y="25" font-family="Arial" font-size="12" fill="#38A169" text-anchor="middle" alignment-baseline="middle">Support</text>
  </g>
  
  <g id="growth-bubble" transform="translate(650, 450)">
    <rect x="0" y="0" width="80" height="40" rx="20" ry="20" fill="#FEEBEF" stroke="#D53F8C" stroke-width="2">
      <animate attributeName="y" values="0;5;0" dur="6.5s" repeatCount="indefinite" />
    </rect>
    <text x="40" y="25" font-family="Arial" font-size="12" fill="#D53F8C" text-anchor="middle" alignment-baseline="middle">Growth</text>
  </g>
</svg>
                </motion.div>
                
                {/* Floating elements */}
                
                
                
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <AnimatedSection className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="text-center"
              >
                <motion.p 
                  className="text-4xl font-bold text-teal-600"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-teal-100 text-teal-800 rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Your Path to Better Mental Health</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              MindEase provides a structured approach to improving your mental wellbeing through these simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <div className="bg-white rounded-xl p-6 shadow-md h-full flex flex-col">
                  <div className={`inline-flex items-center justify-center p-3 bg-gradient-to-r ${step.color} rounded-full mb-4 shadow-lg`}>
                    {step.icon}
                    <span className="sr-only">{step.title}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 flex-grow">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 right-0 transform translate-x-1/2">
                      <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.7071 8.70711C40.0976 8.31658 40.0976 7.68342 39.7071 7.29289L33.3431 0.928932C32.9526 0.538408 32.3195 0.538408 31.9289 0.928932C31.5384 1.31946 31.5384 1.95262 31.9289 2.34315L37.5858 8L31.9289 13.6569C31.5384 14.0474 31.5384 14.6805 31.9289 15.0711C32.3195 15.4616 32.9526 15.4616 33.3431 15.0711L39.7071 8.70711ZM0 9H39V7H0V9Z" fill="#D1D5DB"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-3">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-teal-100 text-teal-800 font-semibold">
                    {index + 1}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Features That Support Your Journey</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to help you understand, track, and improve your mental wellness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Volunteer Section */}
      <AnimatedSection className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <motion.div variants={fadeIn} className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <span className="inline-block px-3 py-1 text-sm font-semibold bg-teal-100 text-teal-800 rounded-full mb-4">
                Join Our Community
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Make a Difference as a Volunteer
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Use your expertise to support others on their mental health journey. Join our network of certified volunteers.
              </p>
              <ul className="space-y-4 mb-8">
                <motion.li 
                  variants={fadeIn}
                  className="flex items-start bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0 p-1 bg-teal-100 rounded-full">
                    <FaCheck className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-gray-700 ml-3">Share your knowledge and experience</span>
                </motion.li>
                <motion.li 
                  variants={fadeIn}
                  className="flex items-start bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0 p-1 bg-teal-100 rounded-full">
                    <FaCheck className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-gray-700 ml-3">Help users interpret their assessment results</span>
                </motion.li>
                <motion.li 
                  variants={fadeIn}
                  className="flex items-start bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0 p-1 bg-teal-100 rounded-full">
                    <FaCheck className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-gray-700 ml-3">Guide users to appropriate professional resources</span>
                </motion.li>
              </ul>
              <motion.div 
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/volunteer-register"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-md"
                >
                  Apply to Volunteer <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
  variants={fadeIn}
  className="md:w-1/2"
>
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-blue-200 rounded-2xl transform rotate-3"></div>
    <VolunteerIllustration />
    <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 z-20">
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <img 
              key={i}
              src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i * 10}.jpg`}
              alt="Volunteer"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
          ))}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700">Join 500+ volunteers</span>
      </div>
    </div>
  </div>
</motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Stories from people who have benefited from MindEase.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border border-gray-100 relative"
              >
                <div className="absolute top-4 right-4 text-yellow-400 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="h-4 w-4" />
                  ))}
                </div>
                <FaQuoteLeft className="h-8 w-8 text-teal-200 mb-4" />
                <p className="text-gray-600 italic mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            variants={fadeIn}
            className="mt-12 text-center"
          >
            <Link
              to="/testimonials"
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
            >
              Read more success stories <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-indigo-100 text-indigo-800 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-xl text-gray-600">
              Find answers to common questions about MindEase.
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {[
              {
                question: "Is MindEase a substitute for professional mental health care?",
                answer: "No, MindEase is designed to complement professional care, not replace it. Our platform provides tools for self-assessment and self-help, but we always recommend consulting with qualified mental health professionals for diagnosis and treatment."
              },
              {
                question: "How is my data protected on MindEase?",
                answer: "We take data privacy very seriously. All your personal information and assessment results are encrypted and stored securely. We comply with HIPAA regulations and never share your data with third parties without your explicit consent."
              },
              {
                question: "Who are the volunteers on MindEase?",
                answer: "Our volunteers include mental health professionals, counselors, psychologists, and trained peer supporters. All volunteers go through a rigorous verification process and training program before they can provide support on our platform."
              },
              {
                question: "How often should I take the mental health assessments?",
                answer: "We recommend taking assessments regularly, typically every 2-4 weeks, to track changes in your mental health status. However, you can take them whenever you feel there might be a significant change in your mental wellbeing."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            variants={fadeIn}
            className="mt-10 text-center"
          >
            <Link
              to="/faq"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all FAQs <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-16 bg-gradient-to-r from-teal-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/pattern-bg.png')] opacity-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div variants={fadeIn}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Mental Wellness Journey Today</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
              Join thousands of users who are taking control of their mental health with MindEase's personalized approach.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md flex items-center"
                >
                  Sign Up Now <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-blue-600/30 transition-colors backdrop-blur-sm"
                >
                  Log In
                </Link>
              </motion.div>
            </div>
            
            <div className="mt-12 flex flex-col items-center">
              <div className="flex items-center mb-3">
                <FaShieldAlt className="text-blue-200 mr-2" />
                <span className="text-blue-100">Your privacy is our priority</span>
              </div>
              <p className="text-sm text-blue-200 max-w-md">
                By signing up, you agree to our Terms of Service and Privacy Policy. 
                You can opt out of communications at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default LandingPage;