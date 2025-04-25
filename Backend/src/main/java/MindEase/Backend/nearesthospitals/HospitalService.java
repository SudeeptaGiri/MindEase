package MindEase.Backend.nearesthospitals;


import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.model.LatLng;
import com.google.maps.model.PlaceType;
import com.google.maps.model.PlacesSearchResponse;
import com.google.maps.model.PlacesSearchResult;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalService {

    private GeoApiContext context;

    @PostConstruct
    public void init() {
        // Initialize the Google Maps API context
        context = new GeoApiContext.Builder()
                .apiKey("Api - Key")
                .build();
    }

    public List<HospitalDTO> findNearbyHospitals(double latitude, double longitude) {
        try {
            PlacesSearchResponse response = PlacesApi.nearbySearchQuery(context, new LatLng(latitude, longitude))
                    .radius(5000) // 5km radius
                    .type(PlaceType.HOSPITAL)
                    .keyword("mental health")
                    .await();

            return Arrays.stream(response.results)
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error finding nearby hospitals", e);
        }
    }

    private HospitalDTO convertToDTO(PlacesSearchResult result) {
        return new HospitalDTO(
                result.name,
                result.geometry.location.lat,
                result.geometry.location.lng,
                result.vicinity
        );
    }
}