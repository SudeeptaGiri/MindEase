// dto/SuggestionDTO.java
package MindEase.Backend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class SuggestionDTO {
    private Map<String, CategoryDTO> categories;

    @Data
    public static class CategoryDTO {
        private String title;
        private List<String> tasks;
    }
}