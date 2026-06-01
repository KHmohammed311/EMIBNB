package ma.airbnbclone.repository;

import ma.airbnbclone.document.ActiviteReservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActiviteReservationRepository extends MongoRepository<ActiviteReservation, String> {

    List<ActiviteReservation> findByVoyageurId(String voyageurId);

    List<ActiviteReservation> findByActiviteId(String activiteId);

    List<ActiviteReservation> findByStatut(String statut);
}
