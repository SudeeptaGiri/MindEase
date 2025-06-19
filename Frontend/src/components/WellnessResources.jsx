// src/components/WellnessResources.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaYoutube,
  FaBookOpen,
  FaRunning,
  FaBrain,
  FaHeart,
  FaLeaf,
  FaSpa,
  FaSearch,
  FaBookmark,
  FaRegBookmark,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaDownload,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaArrowLeft,
  FaStar,
  FaRegStar,
  FaStarHalfAlt
} from 'react-icons/fa';
import { MdSelfImprovement } from 'react-icons/md'; // ✅ Correct icon for meditation



const WellnessResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Resources', icon: FaBookOpen },
    { id: 'yoga', name: 'Yoga', icon: FaSpa },
    { id: 'meditation', name: 'Meditation', icon: MdSelfImprovement },
    { id: 'exercise', name: 'Exercise', icon: FaRunning },
    { id: 'mindfulness', name: 'Mindfulness', icon: FaBrain },
    { id: 'nutrition', name: 'Nutrition', icon: FaLeaf },
    { id: 'sleep', name: 'Sleep', icon: FaHeart }
  ];

  // Featured resources for the carousel
  const featuredResources = [
    {
      id: 'featured-1',
      title: '30-Day Mindfulness Challenge',
      description: 'Transform your mental wellbeing with daily mindfulness practices',
      category: 'mindfulness',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      type: 'program'
    },
    {
      id: 'featured-2',
      title: 'Beginner Yoga Series',
      description: 'Start your yoga journey with these gentle, guided practices',
      category: 'yoga',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      type: 'video'
    },
    {
      id: 'featured-3',
      title: 'Stress Relief Meditation',
      description: 'A 15-minute guided meditation to calm your mind and reduce stress',
      category: 'meditation',
      imageUrl: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      type: 'audio'
    }
  ];

  // Mock resource data
  const mockResources = [
  // Yoga Resources
  {
    id: 1,
    title: 'Beginner Yoga Flow',
    description: 'A gentle 20-minute yoga sequence perfect for beginners',
    category: 'yoga',
    type: 'video',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '20 min',
    rating: 4.8,
    difficulty: 'Beginner'
  },
  {
    id: 2,
    title: 'Yoga for Stress Relief',
    description: 'Relieve tension and anxiety with these calming yoga poses',
    category: 'yoga',
    type: 'video',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=hJbRpHZr_d0',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '30 min',
    rating: 4.9,
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'Morning Yoga Routine',
    description: 'Start your day with energy and focus through this morning practice',
    category: 'yoga',
    type: 'article',
    source: 'Bodhi Surf Yoga',
    url: 'https://www.bodhisurfyoga.com/morning-yoga-routine',
    imageUrl: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    readTime: '5 min',
    rating: 4.6
  },
  {
    id: 4,
    title: '10 Essential Yoga Poses',
    description: 'Master these fundamental poses to build a strong yoga foundation',
    category: 'yoga',
    type: 'pdf',
    source: 'NIBM E‑Library',
    url: 'https://nibmehub.com/opac-service/pdf/read/30%20Essential%20Yoga%20Poses%20_%20for%20beginning%20students%20and%20their%20teachers.pdf',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    pages: 12,
    rating: 4.7
  },
  
  // Meditation Resources
  {
    id: 5,
    title: '5-Minute Breathing Meditation',
    description: 'A quick meditation practice to center yourself during busy days',
    category: 'meditation',
    type: 'audio',
    source: 'UCLA Mindful (SoundCloud)',
    url: 'https://soundcloud.com/mindfulmagazine/5-minute-breathing-meditation',
    imageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '5 min',
    rating: 4.5
  },
  {
    id: 6,
    title: 'Body Scan Meditation',
    description: 'Reduce physical tension and increase body awareness',
    category: 'meditation',
    type: 'video',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=QS2yDmWk0vs',
    imageUrl: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '15 min',
    rating: 4.9,
    difficulty: 'Beginner'
  },
  {
    id: 7,
    title: 'Mindfulness Meditation Guide',
    description: 'Learn the principles and practices of mindfulness meditation',
    category: 'meditation',
    type: 'article',
    source: 'Mindful Eating Center Blog',
    url: 'https://blog.thecenterformindfuleating.org/the-practice-of-mindful-eating.html',
    imageUrl: 'https://images.unsplash.com/photo-1470137237906-d8a4f71e1966?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    readTime: '8 min',
    rating: 4.7
  },
  
  // Exercise Resources
  {
    id: 8,
    title: '15-Minute Home Workout',
    description: 'A quick, equipment-free workout you can do anywhere',
    category: 'exercise',
    type: 'video',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '15 min',
    rating: 4.8,
    difficulty: 'Beginner'
  },
  {
    id: 9,
    title: 'Walking Meditation',
    description: 'Combine physical activity with mindfulness through walking meditation',
    category: 'exercise',
    type: 'audio',
    source: 'MindEase Audio',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1538438253612-287c9fc9217e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '10 min',
    rating: 4.6
  },
  
  // Mindfulness Resources
  {
    id: 10,
    title: 'Mindful Eating Practice',
    description: 'Transform your relationship with food through mindfulness',
    category: 'mindfulness',
    type: 'article',
    source: 'Harvard Nutrition Source',
    url: 'https://nutritionsource.hsph.harvard.edu/mindful-eating/',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    readTime: '6 min',
    rating: 4.5
  },
  {
    id: 11,
    title: 'Mindfulness for Anxiety',
    description: 'Specific mindfulness techniques to manage anxiety symptoms',
    category: 'mindfulness',
    type: 'video',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '25 min',
    rating: 4.9,
    difficulty: 'All levels'
  },
  
  // Nutrition Resources
  {
    id: 12,
    title: 'Foods That Boost Mental Health',
    description: 'Discover the connection between nutrition and mental wellbeing',
    category: 'nutrition',
    type: 'article',
    source: 'Polk Health Care Blog',
    url: 'https://polkhealthcareplan.net/blog/5-foods-to-boost-your-mental-health/',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    readTime: '7 min',
    rating: 4.7
  },
  {
    id: 13,
    title: 'Meal Planning for Wellness',
    description: 'Simple strategies for nutritious eating to support mental health',
    category: 'nutrition',
    type: 'pdf',
    source: 'MindEase Resources',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    pages: 15,
    rating: 4.8
  },
  
  // Sleep Resources
  {
    id: 14,
    title: 'Sleep Meditation',
    description: 'A calming meditation to help you fall asleep naturally',
    category: 'sleep',
    type: 'audio',
    source: 'MindEase Audio',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '20 min',
    rating: 4.9
  },
  {
    id: 15,
    title: 'Better Sleep Habits',
    description: 'Science-backed tips for improving your sleep quality',
    category: 'sleep',
    type: 'article',
    source: 'MindEase Blog',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1455642305367-68834a9c8827?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    readTime: '6 min',
    rating: 4.6
  },
  {
    id: 16,
    title: 'Yoga for Better Sleep',
    description: 'Gentle evening yoga practice to prepare your body for rest',
    category: 'sleep',
    type: 'video',
    source: 'YouTube',
    url: 'https://www.youtube.com/watch?v=BiWDsfZ3zbo',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    duration: '15 min',
    rating: 4.8,
    difficulty: 'Beginner'
  }
];

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    // In a real app, fetch resources from API
    // For now, use mock data
    setTimeout(() => {
      setResources(mockResources);
      setFilteredResources(mockResources);
      setLoading(false);
    }, 800);

    // Load bookmarked resources from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedResources');
    if (savedBookmarks) {
      setBookmarkedResources(JSON.parse(savedBookmarks));
    }
  }, [navigate]);

  useEffect(() => {
    // Filter resources based on category, search term, and bookmarks
    let filtered = resources;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(term) || 
        resource.description.toLowerCase().includes(term) ||
        resource.category.toLowerCase().includes(term)
      );
    }

    if (showBookmarksOnly) {
      filtered = filtered.filter(resource => 
        bookmarkedResources.includes(resource.id)
      );
    }

    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [resources, activeCategory, searchTerm, showBookmarksOnly, bookmarkedResources]);

  const toggleBookmark = (id) => {
    let updatedBookmarks;
    
    if (bookmarkedResources.includes(id)) {
      updatedBookmarks = bookmarkedResources.filter(bookmarkId => bookmarkId !== id);
    } else {
      updatedBookmarks = [...bookmarkedResources, id];
    }
    
    setBookmarkedResources(updatedBookmarks);
    localStorage.setItem('bookmarkedResources', JSON.stringify(updatedBookmarks));
  };

  const openVideoModal = (resource) => {
    setSelectedVideo(resource);
    setShowVideoModal(true);
  };

  const handleCarouselScroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render star ratings
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-amber-400" />);
      }
    }
    
    return (
      <div className="flex items-center">
        <div className="flex">{stars}</div>
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Render resource card based on type
  const renderResourceCard = (resource) => {
    const isBookmarked = bookmarkedResources.includes(resource.id);
    
    return (
      <motion.div 
        key={resource.id}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full flex flex-col"
      >
        <div className="relative">
          <img 
            src={resource.imageUrl} 
            alt={resource.title}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => toggleBookmark(resource.id)}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
            aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            {isBookmarked ? (
              <FaBookmark className="h-4 w-4 text-teal-600" />
            ) : (
              <FaRegBookmark className="h-4 w-4 text-gray-600 hover:text-teal-600" />
            )}
          </button>
          
          {resource.type === 'video' && (
            <button
              onClick={() => openVideoModal(resource)}
              className="absolute bottom-2 right-2 p-2 bg-teal-600 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              aria-label="Play video"
            >
              <FaPlay className="h-4 w-4 text-white" />
            </button>
          )}
          
          <div className="absolute bottom-2 left-2">
            <span className={`
              inline-block px-2 py-1 text-xs font-medium rounded-md
              ${resource.type === 'video' ? 'bg-red-100 text-red-800' : 
                resource.type === 'audio' ? 'bg-purple-100 text-purple-800' : 
                resource.type === 'article' ? 'bg-blue-100 text-blue-800' : 
                'bg-green-100 text-green-800'}
            `}>
              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 flex-grow">{resource.description}</p>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 flex items-center">
                {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
              </span>
              <span className="text-xs text-gray-500">
                {resource.duration || resource.readTime || (resource.pages && `${resource.pages} pages`)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              {renderRating(resource.rating)}
              
              {resource.url && (
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center"
                >
                  {resource.type === 'pdf' ? 'Download' : 'View'} <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-8 lg:px-16">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-teal-100 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-indigo-100 opacity-30 blur-3xl"></div>
          <div className="absolute top-[40%] right-[20%] w-48 h-48 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="mr-4 text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Wellness Resources</h1>
          </div>
          <p className="text-gray-600 mb-8">Discover tools and practices to support your mental wellbeing journey</p>

          {/* Featured Resources Carousel */}
          <div className="relative mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Featured Resources</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCarouselScroll('left')}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label="Previous slide"
                >
                  <FaChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleCarouselScroll('right')}
                  className="p-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                  aria-label="Next slide"
                >
                  <FaChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto space-x-6 pb-4 hide-scrollbar snap-x"
            >
              {featuredResources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="flex-shrink-0 w-full md:w-2/3 lg:w-1/2 snap-start"
                >
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="h-64 rounded-2xl overflow-hidden relative shadow-lg"
                  >
                    <img 
                      src={resource.imageUrl} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 p-6">
                        <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-md mb-2 inline-block">
                          {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                        </span>
                        <h3 className="text-white text-xl font-bold mb-1">{resource.title}</h3>
                        <p className="text-gray-200 text-sm mb-3">{resource.description}</p>
                        <button className="px-4 py-2 bg-white text-teal-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center">
                          Explore <FaChevronRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources..."
                  className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-teal-500 focus:border-teal-500 block w-full rounded-lg text-black"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    showBookmarksOnly 
                      ? 'bg-teal-50 border-teal-200 text-teal-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {showBookmarksOnly ? (
                    <FaBookmark className="mr-2 h-4 w-4" />
                  ) : (
                    <FaRegBookmark className="mr-2 h-4 w-4" />
                  )}
                  Bookmarks
                </button>
                
                <div className="relative">
                  <button
                    className="flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaFilter className="mr-2 h-4 w-4" />
                    Filter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="mb-8 overflow-x-auto hide-scrollbar">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-teal-100 text-teal-800 font-medium'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } transition-colors shadow-sm border border-gray-100`}
                >
                  {React.createElement(category.icon, { className: 'mr-2 h-4 w-4' })}
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
              <p className="text-gray-500">Loading resources...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center">
              <FaInfoCircle className="h-5 w-5 mr-3" />
              <span>{error}</span>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <FaSearch className="h-6 w-6 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h2>
              <p className="text-gray-600 mb-4">
                {showBookmarksOnly 
                  ? "You haven't bookmarked any resources yet." 
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {showBookmarksOnly && (
                <button
                  onClick={() => setShowBookmarksOnly(false)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  View All Resources
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentItems.map(resource => renderResourceCard(resource))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <FaChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show limited page numbers with ellipsis
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === pageNumber
                                ? 'bg-teal-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={pageNumber}>...</span>;
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <FaChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={selectedVideo.url.replace('watch?v=', 'embed/')}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedVideo.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{selectedVideo.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-md font-medium mr-2">
                      {selectedVideo.difficulty || 'All Levels'}
                    </span>
                    <span className="text-gray-500 text-sm">{selectedVideo.duration}</span>
                  </div>
                  
                  {renderRating(selectedVideo.rating)}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg mr-2 hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
                >
                  Open in YouTube <FaExternalLinkAlt className="ml-2 h-3 w-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WellnessResources;