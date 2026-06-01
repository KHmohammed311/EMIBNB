package ma.airbnbclone.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Annonce;
import ma.airbnbclone.service.AnnonceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/annonces")
@RequiredArgsConstructor
public class AnnonceController {

    private final AnnonceService annonceService;

    // GET /api/annonces?ville=Marrakech&prixMin=200&prixMax=1000&type=villa&nbVoyageurs=4
    @GetMapping
    public ResponseEntity<List<Annonce>> listerAnnonces(
            @RequestParam(required = false) String ville,
            @RequestParam(required = false) Double prixMin,
            @RequestParam(required = false) Double prixMax,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer nbVoyageurs) {

        List<Annonce> annonces = annonceService.rechercherAnnonces(
                ville, prixMin, prixMax, type, nbVoyageurs);
        return ResponseEntity.ok(annonces);
    }

    // GET /api/annonces/top
    @GetMapping("/top")
    public ResponseEntity<List<Annonce>> top5() {
        return ResponseEntity.ok(annonceService.top5());
    }

    // GET /api/annonces/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Annonce> detail(@PathVariable String id) {
        return ResponseEntity.ok(annonceService.findById(id));
    }

    // POST /api/annonces
    @PostMapping
    public ResponseEntity<Annonce> creer(@Valid @RequestBody Annonce annonce) {
        return ResponseEntity.status(HttpStatus.CREATED).body(annonceService.creer(annonce));
    }

    // PUT /api/annonces/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Annonce> modifier(@PathVariable String id,
                                            @Valid @RequestBody Annonce annonce) {
        return ResponseEntity.ok(annonceService.modifier(id, annonce));
    }

    // DELETE /api/annonces/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable String id) {
        annonceService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
