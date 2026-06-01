package ma.airbnbclone.repository;

import ma.airbnbclone.document.Annonce;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnonceRepository extends MongoRepository<Annonce, String> {

    List<Annonce> findByLocalisationVille(String ville);

    List<Annonce> findByType(String type);

    List<Annonce> findByPrixParNuitBetween(Double min, Double max);

    List<Annonce> findByMaxVoyageursGreaterThanEqual(Integer nb);

    @Query("{ 'localisation.ville': ?0, 'prixParNuit': { $gte: ?1, $lte: ?2 }, 'maxVoyageurs': { $gte: ?3 } }")
    List<Annonce> findByFilters(String ville, Double prixMin, Double prixMax, Integer nbVoyageurs);

    List<Annonce> findTop5ByOrderByNoteMoyenneDesc();

    List<Annonce> findByHoteId(String hoteId);

    @Query("{ 'caracteristiques.piscine': true }")
    List<Annonce> findWithPiscine();
}
