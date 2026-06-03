package ma.airbnbclone.controller;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.service.StatistiquesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatistiquesController {
    private final StatistiquesService statistiquesService;

    @GetMapping("/prix-par-ville")
    public ResponseEntity<List<Map<String, Object>>> prixParVille() {
        return ResponseEntity.ok(statistiquesService.prixParVille());
    }

    @GetMapping("/reservations-par-statut")
    public ResponseEntity<List<Map<String, Object>>> reservationsParStatut() {
        return ResponseEntity.ok(statistiquesService.reservationsParStatut());
    }

    @GetMapping("/top-annonces")
    public ResponseEntity<List<Map<String, Object>>> topAnnonces() {
        return ResponseEntity.ok(statistiquesService.topAnnonces());
    }

    @GetMapping("/hote/{hoteId}")
    public ResponseEntity<Map<String, Object>> statsHote(@PathVariable String hoteId) {
        return ResponseEntity.ok(statistiquesService.statsHote(hoteId));
    }

    @GetMapping("/revenus-mensuels")
    public ResponseEntity<List<Map<String, Object>>> revenusMensuels() {
        return ResponseEntity.ok(statistiquesService.revenusMensuels());
    }
}
