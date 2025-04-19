package MindEase.Backend.dto;

import MindEase.Backend.entity.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String message;

    public static UserResponse of(User user, String message) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setMessage(message);
        return response;
    }
}