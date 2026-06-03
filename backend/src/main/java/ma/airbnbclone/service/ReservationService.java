package ma.airbnbclone.service;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Annonce;
import ma.airbnbclone.document.Reservation;
import ma.airbnbclone.exception.ConflitDatesException;
import ma.airbnbclone.exception.ResourceNotFoundException;
import ma.airbnbclone.neo4j.Neo4jSyncService;
import ma.airbnbclone.repository.AnnonceRepository;
import ma.airbnbclone.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final AnnonceRepository annonceRepository;
    private final Neo4jSyncService neo4jSyncService;

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Reservation findById(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation introuvable : " + id));
    }

    public Reservation creer(Reservation reservation) {
        // Validation de l'annonce
        Annonce annonce = annonceRepository.findById(reservation.getAnnonceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Annonce introuvable : " + reservation.getAnnonceId()));

        // Validation du nombre de voyageurs
        if (reservation.getNbVoyageurs() > annonce.getMaxVoyageurs()) {
            throw new IllegalArgumentException(
                    "Nombre de voyageurs (" + reservation.getNbVoyageurs() +
                    ") dépasse la capacité maximale (" + annonce.getMaxVoyageurs() + ")");
        }

        // Vérification de disponibilité des dates (côté backend)
        List<Reservation> conflits = reservationRepository.findConflictingReservations(
                reservation.getAnnonceId(),
                reservation.getDateArrivee(),
                reservation.getDateDepart()
        );
        if (!conflits.isEmpty()) {
            throw new ConflitDatesException(
                    "Ces dates sont déjà réservées pour cette annonce. " +
                    "Veuillez choisir d'autres dates.");
        }

        // Calcul du prix total
        long nbNuits = ChronoUnit.DAYS.between(
                reservation.getDateArrivee().toLocalDate(),
                reservation.getDateDepart().toLocalDate()
        );
        if (nbNuits <= 0) {
            throw new IllegalArgumentException("La date de départ doit être après la date d'arrivée");
        }
        reservation.setPrixTotal(nbNuits * annonce.getPrixParNuit());
        reservation.setStatut("en_attente");
        reservation.setFraisAnnulation(0.0);
        reservation.setCreatedAt(LocalDateTime.now());

        return reservationRepository.save(reservation);
    }

    public Reservation changerStatut(String id, String nouveauStatut) {
        Reservation reservation = findById(id);

        // Calcul des frais d'annulation si annulée
        if ("annulee".equals(nouveauStatut) && "confirmee".equals(reservation.getStatut())) {
            double frais = calculerFraisAnnulation(reservation);
            reservation.setFraisAnnulation(frais);
        }

        reservation.setStatut(nouveauStatut);
        Reservation saved = reservationRepository.save(reservation);

        // Quand un séjour est terminé ou confirmé, enregistrer la relation A_SEJOURNE dans Neo4j
        if ("terminee".equals(nouveauStatut) || "confirmee".equals(nouveauStatut)) {
            neo4jSyncService.syncSejour(saved.getVoyageurId(), saved.getAnnonceId());
        }

        return saved;
    }

    public void supprimer(String id) {
        if (!reservationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Réservation introuvable : " + id);
        }
        reservationRepository.deleteById(id);
    }

    private double calculerFraisAnnulation(Reservation reservation) {
        Annonce annonce = annonceRepository.findById(reservation.getAnnonceId()).orElse(null);
        if (annonce == null || annonce.getPolitiqueAnnulation() == null) return 0.0;

        long joursAvantArrivee = ChronoUnit.DAYS.between(
                LocalDateTime.now().toLocalDate(),
                reservation.getDateArrivee().toLocalDate()
        );
        int delai = annonce.getPolitiqueAnnulation().getDelaiRemboursement();
        String typePolitique = annonce.getPolitiqueAnnulation().getType();

        if (joursAvantArrivee >= delai) return 0.0;

        return switch (typePolitique) {
            case "flexible" -> reservation.getPrixTotal() * 0.10;
            case "moderee"  -> reservation.getPrixTotal() * 0.50;
            case "stricte"  -> reservation.getPrixTotal() * 1.00;
            default         -> 0.0;
        };
    }
}
