import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaBookmark, FaRegBookmark, FaChevronLeft, FaChevronRight,
  FaInfoCircle, FaArrowLeft, FaStar, FaRegStar, FaStarHalfAlt, FaBookOpen,
  FaSpa, FaRunning, FaBrain, FaLeaf, FaHeart, FaBook
} from 'react-icons/fa';
import { MdSelfImprovement } from 'react-icons/md';
import { fetchSelfHelpBooks } from '../utils/fetchBooks';

const WellnessResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBooks, setShowBooks] = useState(false);
  const [booksLoaded, setBooksLoaded] = useState(false);
  const navigate = useNavigate();

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
  ];

  // Mock resource data (excluding pdf and audio types)
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

    // Meditation Resources
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

    // Sleep Resources
    {
      id: 15,
      title: 'Better Sleep Habits',
      description: 'Science-backed tips for improving your sleep quality',
      category: 'sleep',
      type: 'article',
      source: 'MindEase Blog',
      url: '#',
      imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
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

    // Load saved bookmarks
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedResources') || '[]');
    setBookmarkedResources(savedBookmarks);
  }, [navigate]);

  const handleExploreBooks = async () => {
    if (booksLoaded) {
      setShowBooks(true);
      return;
    }

    setLoading(true);
    setShowBooks(true);

    try {
      const aiBooks = await fetchSelfHelpBooks('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');
      const formattedResources = aiBooks.map((book, index) => ({
        id: `book-${index + 1}`,
        title: book.title,
        description: book.description,
        category: 'mindfulness',
        type: 'book',
        source: book.author,
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80',
        readTime: '5-10 min',
        rating: 4.7
      }));
      setResources(formattedResources);
      setFilteredResources(formattedResources);
      setBooksLoaded(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load book recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showBooks) return;

    let filtered = resources;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term)
      );
    }
    if (showBookmarksOnly) {
      filtered = filtered.filter(resource =>
        bookmarkedResources.includes(resource.id)
      );
    }
    setFilteredResources(filtered);
    setCurrentPage(1);
  }, [resources, searchTerm, showBookmarksOnly, bookmarkedResources, showBooks]);

  const toggleBookmark = (id) => {
    let updated = bookmarkedResources.includes(id)
      ? bookmarkedResources.filter(bid => bid !== id)
      : [...bookmarkedResources, id];
    setBookmarkedResources(updated);
    localStorage.setItem('bookmarkedResources', JSON.stringify(updated));
  };

  const renderRating = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= full) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i === full + 1 && half) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return <div className="flex items-center space-x-1">{stars}<span className="ml-2 text-sm">{rating.toFixed(1)}</span></div>;
  };

  const getFilteredMockResources = () => {
    if (selectedCategory === 'all') return mockResources;
    return mockResources.filter(resource => resource.category === selectedCategory);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/dashboard')} className="mr-4 text-gray-600 hover:text-black flex items-center transition-colors">
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Wellness Resources</h1>
        </div>



        {/* Category Filter */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-3 rounded-lg border transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:shadow-sm'
                  }`}
                >
                  <IconComponent className="mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Resources Grid */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {selectedCategory === 'all' ? 'All Resources' : categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredMockResources().map(resource => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <img src={resource.imageUrl} alt={resource.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {resource.type.toUpperCase()} • {resource.duration || resource.readTime}
                    </span>
                    {renderRating(resource.rating)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Explore Books Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <FaBook className="text-4xl text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Personalized Book Recommendations</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover curated self-help books tailored to your wellness journey. Our AI will find the perfect books to support your mental health and personal growth.
            </p>
            <button
              onClick={handleExploreBooks}
              disabled={loading}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Loading Books...' : booksLoaded ? 'View Book Recommendations' : 'Explore Books'}
            </button>
          </div>
        </section>

        {/* AI Book Recommendations */}
        {showBooks && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">AI Book Recommendations</h2>

            {/* Search + Bookmarks */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`px-6 py-3 border rounded-lg transition-colors duration-200 shadow-sm ${
                  showBookmarksOnly
                    ? 'bg-teal-100 border-teal-300 text-teal-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-teal-300'
                }`}
              >
                {showBookmarksOnly ? <FaBookmark className="inline mr-2" /> : <FaRegBookmark className="inline mr-2" />}
                Bookmarks Only
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading personalized book recommendations...</p>
              </div>
            ) : error ? (
              <div className="text-red-600 flex items-center gap-2 bg-red-50 p-4 rounded-lg border border-red-200">
                <FaInfoCircle /> {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map(book => (
                    <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300 relative">
                      <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover rounded mb-4" />
                      <h3 className="font-bold text-lg mb-2 text-gray-800">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{book.description}</p>
                      <p className="text-xs text-gray-500 mb-3">By {book.source}</p>
                      {renderRating(book.rating)}
                      <button
                        onClick={() => toggleBookmark(book.id)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
                      >
                        {bookmarkedResources.includes(book.id) ?
                          <FaBookmark className="text-teal-600" /> :
                          <FaRegBookmark className="text-gray-400 hover:text-teal-600" />
                        }
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === i + 1
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-teal-300 hover:shadow-sm'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default WellnessResources;