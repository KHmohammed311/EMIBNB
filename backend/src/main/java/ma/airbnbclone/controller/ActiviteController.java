package ma.airbnbclone.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Activite;
import ma.airbnbclone.service.ActiviteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activites")
@RequiredArgsConstructor
public class ActiviteController {

    private final ActiviteService activiteService;

    // GET /api/activites?ville=Marrakech&categorie=Gastronomie
    @GetMapping
    public ResponseEntity<List<Activite>> lister(
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) String categorie) {
        return ResponseEntity.ok(activiteService.rechercherActivites(ville, categorie));
    }

    // GET /api/activites/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Activite> detail(@PathVariable String id) {
        return ResponseEntity.ok(activiteService.findById(id));
    }

    // POST /api/activites
    @PostMapping
    public ResponseEntity<Activite> creer(@Valid @RequestBody Activite activite) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activiteService.creer(activite));
    }

    // PUT /api/activites/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Activite> modifier(@PathVariable String id,
                                              @Valid @RequestBody Activite activite) {
        return ResponseEntity.ok(activiteService.modifier(id, activite));
    }

    // DELETE /api/activites/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable String id) {
        activiteService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
