package ma.airbnbclone.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.ActiviteReservation;
import ma.airbnbclone.service.ActiviteReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activite-reservations")
@RequiredArgsConstructor
public class ActiviteReservationController {

    private final ActiviteReservationService service;

    // GET /api/activite-reservations
    @GetMapping
    public ResponseEntity<List<ActiviteReservation>> lister() {
        return ResponseEntity.ok(service.findAll());
    }

    // POST /api/activite-reservations
    @PostMapping
    public ResponseEntity<ActiviteReservation> creer(@Valid @RequestBody ActiviteReservation reservation) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.creer(reservation));
    }

    // PUT /api/activite-reservations/{id}/statut
    @PutMapping("/{id}/statut")
    public ResponseEntity<ActiviteReservation> changerStatut(@PathVariable String id,
                                                              @RequestBody Map<String, String> body) {
        String statut = body.get("statut");
        if (statut == null || statut.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.changerStatut(id, statut));
    }
}
