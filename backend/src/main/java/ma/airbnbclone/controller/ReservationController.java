package ma.airbnbclone.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Reservation;
import ma.airbnbclone.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // GET /api/reservations
    @GetMapping
    public ResponseEntity<List<Reservation>> lister() {
        return ResponseEntity.ok(reservationService.findAll());
    }

    // GET /api/reservations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> detail(@PathVariable String id) {
        return ResponseEntity.ok(reservationService.findById(id));
    }

    // POST /api/reservations
    @PostMapping
    public ResponseEntity<Reservation> creer(@Valid @RequestBody Reservation reservation) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.creer(reservation));
    }

    // PUT /api/reservations/{id}/statut
    @PutMapping("/{id}/statut")
    public ResponseEntity<Reservation> changerStatut(@PathVariable String id,
                                                      @RequestBody Map<String, String> body) {
        String statut = body.get("statut");
        if (statut == null || statut.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reservationService.changerStatut(id, statut));
    }

    // DELETE /api/reservations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable String id) {
        reservationService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
