package MindEase.Backend.nearesthospitals;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HospitalDTO {
    private String name;
    private double latitude;
    private double longitude;
    private String address;
}
