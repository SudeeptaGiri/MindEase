package MindEase.Backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends JpaRepository<T, ID> {
    Optional<T> findByIdAndUserId(ID id, Long userId);
    boolean existsByIdAndUserId(ID id, Long userId);
}