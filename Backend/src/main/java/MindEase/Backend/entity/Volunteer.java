// MindEase.Backend.entity.Volunteer.java
package MindEase.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "volunteers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Volunteer extends BaseEntity {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Full name is required")
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(name = "credentials")
    private String credentials;
    
    @Column(name = "specialization")
    private String specialization;
    
    @Column(name = "experience")
    private Integer experience;
    
    @Lob
    @Column(name = "certificate_image", columnDefinition = "LONGTEXT")
    private String certificateImage;
    
    @Lob
    @Column(name = "id_proof_image", columnDefinition = "LONGTEXT")
    private String idProofImage;
    
    @Column(name = "approved")
    private Boolean approved = false;
    
    @Column(name = "active")
    private Boolean active = false;
    
    @Column(name = "rejection_reason")
    private String rejectionReason;
}