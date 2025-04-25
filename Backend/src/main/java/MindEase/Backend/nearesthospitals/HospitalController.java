package MindEase.Backend.nearesthospitals;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @PostMapping("/nearby-hospitals")
    public ResponseEntity<List<HospitalDTO>> getNearbyHospitals(@RequestBody LocationDTO location) {
        List<HospitalDTO> hospitals = hospitalService.findNearbyHospitals(location.getLatitude(), location.getLongitude());
        return ResponseEntity.ok(hospitals);
    }
}

