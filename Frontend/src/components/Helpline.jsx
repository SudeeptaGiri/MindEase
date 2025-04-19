import React, { useEffect, useRef, useState } from 'react';
import { FaPhone, FaMapMarkerAlt, FaClock, FaStar } from 'react-icons/fa';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDlApSSp9fl6ahjDrOsDuhXzL-ipa-AZ0E'; // Replace with your API key

const Helpline = () => {
  const mapRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map, setMap] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const emergencyNumbers = [
    { name: 'National Suicide Prevention Lifeline', number: '988' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
    { name: 'SAMHSA National Helpline', number: '1-800-662-4357' },
    { name: 'National Alliance on Mental Illness', number: '1-800-950-6264' },
  ];

  // Initialize Google Maps
  const initializeGoogleMaps = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // Define the callback function
    window.initMap = () => {
      setGoogleMapsLoaded(true);
    };

    // Handle script load error
    script.onerror = () => {
      setError('Failed to load Google Maps API');
      setLoading(false);
    };

    document.head.appendChild(script);
  };

  const initMap = async (position) => {
    if (!window.google) {
      setError('Google Maps not loaded');
      return;
    }

    try {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Create the map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 13,
      });

      setMap(mapInstance);

      // Add user location marker
      new window.google.maps.marker.AdvancedMarkerElement({
        map: mapInstance,
        position: location,
        title: "Your Location",
      });

      // Search for places
      await searchNearbyPlaces(mapInstance, location);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map');
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyPlaces = async (mapInstance, location) => {
    const service = new window.google.maps.places.PlacesService(mapInstance);
    
    const searchTypes = [
      'mental_health',
      'psychologist',
      'psychiatrist',
      'counselor'
    ];

    try {
      for (const type of searchTypes) {
        const request = {
          location: location,
          radius: 5000,
          keyword: type,
          type: ['health']
        };

        const results = await new Promise((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(results);
            } else {
              reject(status);
            }
          });
        });

        // Create markers for results
        results.forEach(place => {
          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapInstance,
            position: place.geometry.location,
            title: place.name,
          });

          marker.addListener("click", () => {
            getPlaceDetails(service, place.place_id);
          });
        });

        setPlaces(prev => [...prev, ...results]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setError('Failed to find nearby services');
    }
  };

  const getPlaceDetails = (service, placeId) => {
    service.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'rating', 'website']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSelectedPlace(place);
        }
      }
    );
  };

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      initializeGoogleMaps();
    }

    // Get user location and initialize map when Google Maps is loaded
    if (googleMapsLoaded) {
      navigator.geolocation.getCurrentPosition(
        initMap,
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    }

    return () => {
      // Cleanup
      if (map) {
        // Cleanup map instance if needed
      }
    };
  }, [googleMapsLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Mental Health Support Near You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find professional help and support services in your area. In case of emergency, please call 988 immediately.
          </p>
        </div>

        {/* Emergency Numbers Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {emergencyNumbers.map((emergency, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">{emergency.name}</h3>
              <a
                href={`tel:${emergency.number.replace(/\D/g,'')}`}
                className="inline-flex items-center text-teal-600 hover:text-teal-700"
              >
                <FaPhone className="mr-2" />
                {emergency.number}
              </a>
            </div>
          ))}
        </div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                <div className="text-red-600 text-center p-4">
                  <p className="font-semibold">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-500 hover:text-red-600 underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            <div ref={mapRef} className="h-[600px] w-full" />
          </div>

          {/* Places List */}
          <div className="bg-white rounded-xl shadow-md p-6 h-[600px] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Nearby Services
            </h3>
            
            {places.length > 0 ? (
              <div className="space-y-4">
                {places.map((place, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPlace?.place_id === place.place_id
                        ? 'bg-teal-50 border-2 border-teal-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <h4 className="font-medium text-gray-900">{place.name}</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-teal-600" />
                        {place.vicinity}
                      </div>
                      {place.rating && (
                        <div className="flex items-center mt-1">
                          <FaStar className="mr-2 text-yellow-400" />
                          {place.rating} ({place.user_ratings_total} reviews)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                {loading ? 'Searching for nearby services...' : 'No services found nearby.'}
              </p>
            )}
          </div>
        </div>

        {/* Selected Place Details */}
        {selectedPlace && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedPlace.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">
                  <FaMapMarkerAlt className="inline mr-2" />
                  {selectedPlace.formatted_address}
                </p>
                {selectedPlace.formatted_phone_number && (
                  <p className="mt-2">
                    <a
                      href={`tel:${selectedPlace.formatted_phone_number}`}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      <FaPhone className="inline mr-2" />
                      {selectedPlace.formatted_phone_number}
                    </a>
                  </p>
                )}
              </div>
              {selectedPlace.opening_hours && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Opening Hours</h4>
                  <ul className="text-sm text-gray-600">
                    {selectedPlace.opening_hours.weekday_text.map((hours, index) => (
                      <li key={index}>{hours}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Helpline;