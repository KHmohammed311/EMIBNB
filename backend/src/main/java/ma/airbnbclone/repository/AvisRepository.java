package ma.airbnbclone.repository;

import ma.airbnbclone.document.Avis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisRepository extends MongoRepository<Avis, String> {

    List<Avis> findByCibleIdAndCibleType(String cibleId, String cibleType);

    List<Avis> findByAuteurId(String auteurId);

    List<Avis> findByCibleIdAndCibleTypeOrderByNoteDesc(String cibleId, String cibleType);

    long countByCibleIdAndCibleType(String cibleId, String cibleType);
}
