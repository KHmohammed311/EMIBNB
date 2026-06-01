package ma.airbnbclone.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Avis;
import ma.airbnbclone.service.AvisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avis")
@RequiredArgsConstructor
public class AvisController {

    private final AvisService avisService;

    // GET /api/avis/{cibleType}/{cibleId}
    // Exemple : GET /api/avis/annonce/665f000000000000000000b1
    @GetMapping("/{cibleType}/{cibleId}")
    public ResponseEntity<List<Avis>> lister(@PathVariable String cibleType,
                                              @PathVariable String cibleId) {
        return ResponseEntity.ok(avisService.findByCible(cibleType, cibleId));
    }

    // POST /api/avis — déclenche le computed + subset pattern automatiquement
    @PostMapping
    public ResponseEntity<Avis> creer(@Valid @RequestBody Avis avis) {
        return ResponseEntity.status(HttpStatus.CREATED).body(avisService.creer(avis));
    }

    // DELETE /api/avis/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable String id) {
        avisService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
