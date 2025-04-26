import React, { useEffect, useRef, useState } from 'react';
import { FaPhone, FaMapMarkerAlt, FaHospital, FaUserMd, FaAmbulance } from 'react-icons/fa';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCQWnl79TrW3aY44m2gCtcn9lEEQbp_hBY';

const Helpline = () => {
  const mapRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map, setMap] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const fetchEmergencyContacts = (map, location) => {
    const service = new window.google.maps.places.PlacesService(map);
    
    // Array of search queries for different types of emergency services
    const searchQueries = [
      { type: 'doctor', keyword: 'psychiatrist', icon: <FaUserMd /> },
  { type: 'doctor', keyword: 'psychologist', icon: <FaUserMd /> },
  { type: 'hospital', keyword: 'mental health clinic', icon: <FaHospital /> },
    ];

    searchQueries.forEach(query => {
      const request = {
        location: location,
        radius: '5000', // 5km radius
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
                fields: ['name', 'formatted_phone_number', 'formatted_address', 'opening_hours']
              },
              (place, detailStatus) => {
                if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                  setEmergencyContacts(prev => [...prev, {
                    name: place.name,
                    phone: place.formatted_phone_number,
                    address: place.formatted_address,
                    type: query.keyword,
                    icon: query.icon,
                    isOpen: place.opening_hours?.isOpen() || false
                  }]);
                }
              }
            );
          });
        }
      });
    });
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      const response = await fetch('http://localhost:8080/api/nearby-hospitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nearby hospitals');
      }

      const hospitals = await response.json();
      setPlaces(hospitals);

      if (map) {
        hospitals.forEach(hospital => {
          const marker = new window.google.maps.Marker({
            map: map,
            position: { lat: hospital.latitude, lng: hospital.longitude },
            title: hospital.name,
          });

          marker.addListener("click", () => {
            setSelectedPlace(hospital);
          });
        });
      }
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
      setError('Failed to fetch nearby hospitals');
    }
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      
      script.onload = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: location,
                zoom: 13,
              });

              setMap(mapInstance);

              // Add user location marker
              new window.google.maps.Marker({
                map: mapInstance,
                position: location,
                title: "Your Location",
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                }
              });

              fetchNearbyHospitals(location.lat, location.lng);
              fetchEmergencyContacts(mapInstance, location);
              setLoading(false);
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

      script.onerror = () => {
        setError('Failed to load Google Maps');
        setLoading(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      const scripts = document.getElementsByTagName('script');
      for (let script of scripts) {
        if (script.src.includes('maps.googleapis.com')) {
          script.remove();
        }
      }
    };
  }, []);

  // Group emergency contacts by type
  const groupedContacts = emergencyContacts.reduce((acc, contact) => {
    if (!acc[contact.type]) {
      acc[contact.type] = [];
    }
    acc[contact.type].push(contact);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sage-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Mental Health Support Near You
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find professional help and emergency services in your area.
          </p>
        </div>

        {/* Emergency Contacts Section */}
        <div className="mb-8">
          {Object.entries(groupedContacts).map(([type, contacts]) => (
            <div key={type} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                {type}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-2">
                      {contact.icon}
                      <h4 className="font-semibold text-gray-900 ml-2">{contact.name}</h4>
                    </div>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone.replace(/\D/g,'')}`}
                        className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-2"
                      >
                        <FaPhone className="mr-2" />
                        {contact.phone}
                      </a>
                    )}
                    <p className="text-sm text-gray-600">
                      <FaMapMarkerAlt className="inline mr-2" />
                      {contact.address}
                    </p>
                    <span className={`text-sm ${contact.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {contact.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

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

          <div className="bg-white rounded-xl shadow-md p-6 h-[600px] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Nearby Hospitals
            </h3>
            
            {places.length > 0 ? (
              <div className="space-y-4">
                {places.map((hospital, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPlace?.name === hospital.name
                        ? 'bg-teal-50 border-2 border-teal-500'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    onClick={() => setSelectedPlace(hospital)}
                  >
                    <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-teal-600" />
                        {hospital.address}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                {loading ? 'Searching for nearby hospitals...' : 'No hospitals found nearby.'}
              </p>
            )}
          </div>
        </div>

        {selectedPlace && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedPlace.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600">
                  <FaMapMarkerAlt className="inline mr-2" />
                  {selectedPlace.address}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Helpline;