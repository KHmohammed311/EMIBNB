package ma.airbnbclone.neo4j;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommandations")
@RequiredArgsConstructor
public class RecommandationController {

    private final RecommandationService recommandationService;

    // GET /api/recommandations/{userId}
    // Retourne les logements recommandés pour un voyageur, triés par score
    @GetMapping("/{userId}")
    public ResponseEntity<List<RecommandationDTO>> recommander(@PathVariable String userId) {
        return ResponseEntity.ok(recommandationService.recommander(userId));
    }

    // GET /api/recommandations/similaires/{annonceId}
    // Retourne les logements similaires (pour la page détail)
    @GetMapping("/similaires/{annonceId}")
    public ResponseEntity<List<RecommandationDTO>> similaires(@PathVariable String annonceId) {
        return ResponseEntity.ok(recommandationService.logementsSimilaires(annonceId));
    }
}
