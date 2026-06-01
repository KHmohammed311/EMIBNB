package ma.airbnbclone.repository;

import ma.airbnbclone.document.Activite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActiviteRepository extends MongoRepository<Activite, String> {

    List<Activite> findByVille(String ville);

    List<Activite> findByCategorie(String categorie);

    List<Activite> findByVilleAndCategorie(String ville, String categorie);

    List<Activite> findByHoteId(String hoteId);
}
