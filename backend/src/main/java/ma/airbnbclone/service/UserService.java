package ma.airbnbclone.service;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.User;
import ma.airbnbclone.exception.ResourceNotFoundException;
import ma.airbnbclone.neo4j.Neo4jSyncService;
import ma.airbnbclone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Neo4jSyncService neo4jSyncService;

    public User findById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + id));
    }

    public User creer(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Un compte existe déjà avec cet email");
        }
        user.setMemberSince(LocalDateTime.now());
        user.setAvgRating(0.0);
        User saved = userRepository.save(user);
        neo4jSyncService.syncVoyageur(saved);
        return saved;
    }

    public User modifier(String id, User données) {
        User existant = findById(id);
        données.setId(existant.getId());
        données.setEmail(existant.getEmail());      // email immuable
        données.setMemberSince(existant.getMemberSince());
        données.setAvgRating(existant.getAvgRating());
        return userRepository.save(données);
    }
}
