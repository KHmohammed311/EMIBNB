package ma.airbnbclone.repository;

import ma.airbnbclone.document.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {

    List<Reservation> findByVoyageurId(String voyageurId);

    List<Reservation> findByAnnonceId(String annonceId);

    List<Reservation> findByStatut(String statut);

    // Vérifie les conflits de dates pour une annonce donnée
    @Query("{ 'annonceId': ?0, 'statut': { $in: ['en_attente', 'confirmee'] }, " +
           "'dateArrivee': { $lt: ?2 }, 'dateDepart': { $gt: ?1 } }")
    List<Reservation> findConflictingReservations(String annonceId,
                                                   LocalDateTime dateArrivee,
                                                   LocalDateTime dateDepart);

    List<Reservation> findByAnnonceIdAndStatutIn(String annonceId, List<String> statuts);
}
