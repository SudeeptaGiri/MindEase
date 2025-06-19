import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPhone, 
  FaMapMarkerAlt, 
  FaHospital, 
  FaUserMd, 
  FaAmbulance, 
  FaExternalLinkAlt, 
  FaClock, 
  FaDirections, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaFilter, 
  FaSearch, 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar,
  FaHeartbeat,
  FaPhoneVolume,
  FaHandHoldingHeart,
  FaListAlt
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDMrE97qHoHLMm4iZJ6YAqpwsLBzJ-Gams';

// National emergency hotlines
const NATIONAL_HOTLINES = [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "1-800-273-8255",
    description: "24/7, free and confidential support for people in distress",
    website: "https://suicidepreventionlifeline.org/",
    icon: <FaPhoneVolume className="text-red-500" />
  },
  {
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "Free 24/7 support for those in crisis",
    website: "https://www.crisistextline.org/",
    icon: <FaHandHoldingHeart className="text-blue-500" />
  },
  {
    name: "SAMHSA's National Helpline",
    phone: "1-800-662-4357",
    description: "Treatment referral and information service (in English and Spanish)",
    website: "https://www.samhsa.gov/find-help/national-helpline",
    icon: <FaHeartbeat className="text-green-500" />
  }
];

const Helpline = () => {
  const mapRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map, setMap] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    open: false,
    maxDistance: 10, // km
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  
  const fetchEmergencyContacts = (map, location) => {
    const service = new window.google.maps.places.PlacesService(map);
    
    // Array of search queries for different types of emergency services
    const searchQueries = [
      { type: 'doctor', keyword: 'psychiatrist', icon: <FaUserMd className="text-indigo-500 text-lg" /> },
      { type: 'doctor', keyword: 'psychologist', icon: <FaUserMd className="text-blue-500 text-lg" /> },
      { type: 'hospital', keyword: 'mental health clinic', icon: <FaHospital className="text-teal-500 text-lg" /> },
      { type: 'hospital', keyword: 'emergency psychiatric', icon: <FaAmbulance className="text-red-500 text-lg" /> },
    ];

    setEmergencyContacts([]); // Clear previous results
    
    const newMarkers = [];

    searchQueries.forEach(query => {
      const request = {
        location: location,
        radius: filters.maxDistance * 1000, // Convert km to meters
        type: query.type,
        keyword: query.keyword,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // For each place, get more details including phone number
          results.slice(0, 5).forEach(result => { // Limit to 5 results per category
            service.getDetails(
              {
                placeId: result.place_id,
                fields: ['name', 'formatted_phone_number', 'formatted_address', 'opening_hours', 'website', 'rating', 'photos', 'geometry', 'place_id']
              },
              (place, detailStatus) => {
                if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                  const newContact = {
                    id: place.place_id,
                    name: place.name,
                    phone: place.formatted_phone_number,
                    address: place.formatted_address,
                    website: place.website,
                    type: query.keyword,
                    icon: query.icon,
                    isOpen: place.opening_hours?.isOpen() || false,
                    rating: place.rating || 0,
                    photo: place.photos?.[0]?.getUrl({ maxWidth: 300, maxHeight: 200 }),
                    location: {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng()
                    },
                    distance: calculateDistance(
                      location.lat, 
                      location.lng, 
                      place.geometry.location.lat(),
                      place.geometry.location.lng()
                    )
                  };
                  
                  setEmergencyContacts(prev => [...prev, newContact]);
                  
                  // Create marker for this place
                  const marker = new window.google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                    title: place.name,
                    icon: {
                      url: getMarkerIconForType(query.keyword),
                      scaledSize: new window.google.maps.Size(30, 30)
                    }
                  });
                  
                  const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                      <div class="p-2">
                        <h3 class="font-bold">${place.name}</h3>
                        <p class="text-sm">${place.formatted_address}</p>
                        ${place.formatted_phone_number ? `<p class="text-sm">${place.formatted_phone_number}</p>` : ''}
                        ${place.rating ? `<p class="text-sm">Rating: ${place.rating} ⭐</p>` : ''}
                      </div>
                    `
                  });
                  
                  marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                    setSelectedPlace(newContact);
                    setShowDetails(true);
                  });
                  
                  newMarkers.push(marker);
                }
              }
            );
          });
        }
      });
    });
    
    setMarkers(prevMarkers => {
      // Clear old markers from the map
      prevMarkers.forEach(marker => marker.setMap(null));
      return newMarkers;
    });
  };

  const getMarkerIconForType = (type) => {
    switch(type) {
      case 'psychiatrist':
        return 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
      case 'psychologist':
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      case 'mental health clinic':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'emergency psychiatric':
        return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return parseFloat(d.toFixed(1));
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/nearby-hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
          radius: filters.maxDistance
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nearby hospitals');
      }

      const hospitals = await response.json();
      
      // Calculate distance for each hospital
      const hospitalsWithDistance = hospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance(latitude, longitude, hospital.latitude, hospital.longitude)
      }));
      
      setPlaces(hospitalsWithDistance);
      
      if (map) {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));
        
        const newMarkers = [];
        
        hospitalsWithDistance.forEach(hospital => {
          const marker = new window.google.maps.Marker({
            map: map,
            position: { lat: hospital.latitude, lng: hospital.longitude },
            title: hospital.name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(30, 30)
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${hospital.name}</h3>
                <p class="text-sm">${hospital.address}</p>
                <p class="text-sm">${hospital.distance} km away</p>
              </div>
            `
          });
          
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
            setSelectedPlace(hospital);
          });
          
          newMarkers.push(marker);
        });
        
        setMarkers(newMarkers);
      }
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      setError('Failed to fetch nearby hospitals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      
      script.onload = () => {
        initMap();
      };

      script.onerror = () => {
        setError('Failed to load Google Maps');
        setLoading(false);
      };

      document.head.appendChild(script);
    };
    
    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            
            setUserLocation(location);

            const mapInstance = new window.google.maps.Map(mapRef.current, {
              center: location,
              zoom: 13,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ],
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_CENTER
              }
            });

            setMap(mapInstance);
            setMapLoaded(true);

            // Add user location marker
            new window.google.maps.Marker({
              map: mapInstance,
              position: location,
              title: "Your Location",
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(30, 30)
              }
            });
            
            // Initialize directions renderer
            const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
              map: mapInstance,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#4338ca',
                strokeWeight: 5,
                strokeOpacity: 0.7
              }
            });
            setDirectionsRenderer(directionsRendererInstance);

            fetchNearbyHospitals(location.lat, location.lng);
            fetchEmergencyContacts(mapInstance, location);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setError('Unable to get your location. Please enable location services.');
            setLoading(false);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Clean up markers when component unmounts
      markers.forEach(marker => marker && marker.setMap(null));
    };
  }, []);
  
  // Effect to update map when filters change
  useEffect(() => {
    if (map && userLocation) {
      fetchEmergencyContacts(map, userLocation);
      fetchNearbyHospitals(userLocation.lat, userLocation.lng);
    }
  }, [filters.maxDistance, map, userLocation]);

  const getDirections = (destination) => {
    if (!map || !userLocation || !directionsRenderer) return;
    
    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: new window.google.maps.LatLng(destination.lat || destination.latitude, destination.lng || destination.longitude),
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          
          // Update the selected place with route information
          const route = result.routes[0].legs[0];
          setSelectedPlace(prev => ({
            ...prev,
            routeInfo: {
              distance: route.distance.text,
              duration: route.duration.text
            }
          }));
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };
  
  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
      setSelectedPlace(prev => ({
        ...prev,
        routeInfo: null
      }));
    }
  };

  // Filter and sort emergency contacts
  const filteredContacts = useMemo(() => {
    let filtered = [...emergencyContacts];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(contact => contact.type === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(query) || 
        contact.address.toLowerCase().includes(query)
      );
    }
    
    // Apply open now filter
    if (filters.open) {
      filtered = filtered.filter(contact => contact.isOpen);
    }
    
    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);
    
    return filtered;
  }, [emergencyContacts, activeCategory, searchQuery, filters.open]);

  // Group emergency contacts by type
  const groupedContacts = useMemo(() => {
    return filteredContacts.reduce((acc, contact) => {
      if (!acc[contact.type]) {
        acc[contact.type] = [];
      }
      acc[contact.type].push(contact);
      return acc;
    }, {});
  }, [filteredContacts]);

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...new Set(emergencyContacts.map(contact => contact.type))];
  }, [emergencyContacts]);
  
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-amber-400 text-sm" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-amber-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-amber-400 text-sm" />
        ))}
        <span className="ml-1 text-xs text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Mental Health Support Resources
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find professional mental health services, crisis support, and emergency resources near you.
          </p>
        </motion.div>

        {/* National Crisis Hotlines */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <FaPhoneVolume className="text-red-600 text-xl mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              National Crisis Hotlines
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {NATIONAL_HOTLINES.map((hotline, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-all duration-300 border border-red-100"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-red-50 rounded-full mr-3">
                    {hotline.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">{hotline.name}</h4>
                </div>
                <a
                  href={`tel:${hotline.phone.replace(/\D/g,'')}`}
                  className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-2 text-lg"
                >
                  <FaPhone className="mr-2" />
                  {hotline.phone}
                </a>
                <p className="text-sm text-gray-600 mb-3">
                  {hotline.description}
                </p>
                {hotline.website && (
                  <a 
                    href={hotline.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    Visit Website <FaExternalLinkAlt className="ml-1 text-xs" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs for Map and List views */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('map')}
              className={`py-3 px-6 font-medium text-sm flex items-center ${
                activeTab === 'map'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaMapMarkerAlt className="mr-2" /> Map View
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-3 px-6 font-medium text-sm flex items-center ${
                activeTab === 'list'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaListAlt className="mr-2" /> List View
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-xl shadow-sm p-4"
        >
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Services' : category}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm text-black"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, open: !prev.open }))}
                className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center ${
                  filters.open
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                <FaClock className="mr-1" />
                Open Now
              </button>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="distance" className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  Max {filters.maxDistance} km
                </label>
                <input
                  id="distance"
                  type="range"
                  min="1"
                  max="20"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                  className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer text-black"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {activeTab === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden relative"
            >
              {loading && !mapLoaded && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
                  <p className="text-gray-600">Loading map and finding resources near you...</p>
                </div>
              )}
              {error && (
                <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                  <div className="text-red-600 text-center p-4 max-w-md">
                    <FaExclamationTriangle className="mx-auto h-10 w-10 mb-3" />
                    <p className="font-semibold mb-2">{error}</p>
                    <p className="text-sm mb-4">We need your location to find resources near you. Please enable location services in your browser settings.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              <div ref={mapRef} className="h-[600px] w-full" />
              
              <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <div className="text-sm font-medium mb-2">Map Legend</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs">Your Location</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-xs">Psychiatrist</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs">Mental Health Clinic</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-xs">Emergency</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md h-[600px] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaHospital className="mr-2 text-teal-600" />
                  Nearby Services
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredContacts.length} found
                </span>
              </div>
              
              {loading && filteredContacts.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mb-4"></div>
                  <p className="text-gray-500 text-center">Searching for mental health services near you...</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-6">
                  <FaInfoCircle className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center">No services found matching your criteria. Try adjusting your filters or increasing the search radius.</p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-grow">
                  <AnimatePresence>
                    {filteredContacts.map((contact, index) => (
                      <motion.div
                        key={contact.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedPlace?.id === contact.id ? 'bg-teal-50' : ''
                        }`}
                        onClick={() => {
                          setSelectedPlace(contact);
                          setShowDetails(true);
                          
                          // Center map on this location
                          if (map && contact.location) {
                            map.setCenter(contact.location);
                            map.setZoom(15);
                          }
                        }}
                      >
                        <div className="flex items-start">
                          {contact.photo ? (
                            <img 
                              src={contact.photo} 
                              alt={contact.name} 
                              className="w-16 h-16 object-cover rounded-lg mr-3"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                              {contact.icon || <FaHospital className="text-gray-400 text-xl" />}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-gray-900 text-sm mb-1 truncate pr-2">{contact.name}</h4>
                              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                {contact.distance} km
                              </span>
                            </div>
                            
                            {contact.rating > 0 && (
                              <div className="mb-1">
                                {renderStarRating(contact.rating)}
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-600 mb-1 truncate">
                              <FaMapMarkerAlt className="inline mr-1 text-gray-400" />
                              {contact.address}
                            </p>
                            
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                contact.isOpen 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {contact.isOpen ? 'Open Now' : 'Closed'}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {contact.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          // List View
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredContacts.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
                    <p className="text-gray-600">Searching for mental health services near you...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FaInfoCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Results Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      We couldn't find any mental health services matching your criteria. Try adjusting your filters or increasing the search radius.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {contact.photo ? (
                    <div className="h-40 w-full overflow-hidden">
                      <img 
                        src={contact.photo} 
                        alt={contact.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-gradient-to-r from-teal-50 to-blue-50 flex items-center justify-center">
                      <div className="p-4 bg-white rounded-full">
                        {contact.icon || <FaHospital className="text-teal-500 text-3xl" />}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">{contact.name}</h4>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">
                        {contact.distance} km
                      </span>
                    </div>
                    
                    {contact.rating > 0 && (
                      <div className="mb-2">
                        {renderStarRating(contact.rating)}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-3">
                      <FaMapMarkerAlt className="inline mr-1 text-gray-500" />
                      {contact.address}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        contact.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {contact.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {contact.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone.replace(/\D/g,'')}`}
                          className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700"
                        >
                          <FaPhone className="mr-2" />
                          {contact.phone}
                        </a>
                      )}
                      
                      {contact.website && (
                        <a 
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                        >
                          Visit Website <FaExternalLinkAlt className="ml-1 text-xs" />
                        </a>
                      )}
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          getDirections(contact.location);
                          setSelectedPlace(contact);
                          setActiveTab('map');
                        }}
                        className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg flex items-center justify-center"
                      >
                        <FaDirections className="mr-1" /> Directions
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlace(contact);
                          setShowDetails(true);
                        }}
                        className="py-2 px-3 border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                        data-tooltip-id="details-tooltip"
                        data-tooltip-content="View Details"
                      >
                        <FaInfoCircle />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Details Slide-in Panel */}
        <AnimatePresence>
          {selectedPlace && showDetails && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Resource Details</h3>
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {selectedPlace.photo ? (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
                    <img 
                      src={selectedPlace.photo} 
                      alt={selectedPlace.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg flex items-center justify-center mb-6">
                    <div className="p-4 bg-white rounded-full">
                      {selectedPlace.icon || <FaHospital className="text-teal-500 text-3xl" />}
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 text-lg mb-1">{selectedPlace.name}</h4>
                  {selectedPlace.rating > 0 && (
                    <div className="mb-2">
                      {renderStarRating(selectedPlace.rating)}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedPlace.isOpen 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPlace.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {selectedPlace.type || 'Medical Facility'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-teal-600 mt-1 mr-3" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Address</h5>
                      <p className="text-sm text-gray-600">{selectedPlace.address}</p>
                      <p className="text-xs text-teal-600 mt-1">{selectedPlace.distance} km from your location</p>
                    </div>
                  </div>
                  
                  {selectedPlace.phone && (
                    <div className="flex items-start">
                      <FaPhone className="text-teal-600 mt-1 mr-3" />
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Phone</h5>
                        <a
                          href={`tel:${selectedPlace.phone.replace(/\D/g,'')}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {selectedPlace.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {selectedPlace.website && (
                    <div className="flex items-start">
                      <FaExternalLinkAlt className="text-teal-600 mt-1 mr-3" />
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Website</h5>
                        <a
                          href={selectedPlace.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 break-words"
                        >
                          {selectedPlace.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {selectedPlace.routeInfo && (
                    <div className="flex items-start">
                      <FaDirections className="text-teal-600 mt-1 mr-3" />
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Directions</h5>
                        <p className="text-sm text-gray-600">
                          Distance: {selectedPlace.routeInfo.distance}<br />
                          Estimated travel time: {selectedPlace.routeInfo.duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (selectedPlace.location) {
                        getDirections(selectedPlace.location);
                        setShowDetails(false);
                        setActiveTab('map');
                      }
                    }}
                    className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg flex items-center justify-center"
                  >
                    <FaDirections className="mr-2" /> Get Directions
                  </button>
                  
                  {selectedPlace.phone && (
                    <a
                      href={`tel:${selectedPlace.phone.replace(/\D/g,'')}`}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
                    >
                      <FaPhone className="mr-2" /> Call Now
                    </a>
                  )}
                  
                  {selectedPlace.website && (
                    <a
                      href={selectedPlace.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-lg flex items-center justify-center"
                    >
                      Visit Website <FaExternalLinkAlt className="ml-2 text-sm" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Overlay for slide-in panel */}
        <AnimatePresence>
          {selectedPlace && showDetails && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowDetails(false)}
            />
          )}
        </AnimatePresence>
      </div>
      
      <Tooltip id="details-tooltip" />
    </div>
  );
};

export default Helpline;