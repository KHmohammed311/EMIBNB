package ma.airbnbclone.service;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Annonce;
import ma.airbnbclone.document.Avis;
import ma.airbnbclone.exception.ResourceNotFoundException;
import ma.airbnbclone.neo4j.Neo4jSyncService;
import ma.airbnbclone.repository.AnnonceRepository;
import ma.airbnbclone.repository.AvisRepository;
import ma.airbnbclone.repository.UserRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnonceService {

    private final AnnonceRepository annonceRepository;
    private final AvisRepository avisRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final Neo4jSyncService neo4jSyncService;

    public List<Annonce> rechercherAnnonces(String ville, Double prixMin, Double prixMax,
                                             String type, Integer nbVoyageurs) {
        Query query = new Query();

        if (ville != null && !ville.isBlank()) {
            query.addCriteria(Criteria.where("localisation.ville")
                    .regex(ville, "i"));
        }
        if (type != null && !type.isBlank()) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (prixMin != null || prixMax != null) {
            Criteria prixCriteria = Criteria.where("prixParNuit");
            if (prixMin != null) prixCriteria = prixCriteria.gte(prixMin);
            if (prixMax != null) prixCriteria = prixCriteria.lte(prixMax);
            query.addCriteria(prixCriteria);
        }
        if (nbVoyageurs != null) {
            query.addCriteria(Criteria.where("maxVoyageurs").gte(nbVoyageurs));
        }

        return mongoTemplate.find(query, Annonce.class);
    }

    public Annonce findById(String id) {
        return annonceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Annonce introuvable : " + id));
    }

    public Annonce creer(Annonce annonce) {
        annonce.setNoteMoyenne(0.0);
        annonce.setNbAvis(0);
        Annonce saved = annonceRepository.save(annonce);
        neo4jSyncService.syncAnnonce(saved);
        return saved;
    }

    public Annonce modifier(String id, Annonce données) {
        Annonce existante = findById(id);
        données.setId(existante.getId());
        données.setNoteMoyenne(existante.getNoteMoyenne());
        données.setNbAvis(existante.getNbAvis());
        données.setTopAvis(existante.getTopAvis());
        Annonce saved = annonceRepository.save(données);
        neo4jSyncService.syncAnnonce(saved);
        return saved;
    }

    public void supprimer(String id) {
        if (!annonceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Annonce introuvable : " + id);
        }
        annonceRepository.deleteById(id);
        neo4jSyncService.deleteAnnonce(id);
    }

    public List<Annonce> top5() {
        return annonceRepository.findTop5ByOrderByNoteMoyenneDesc();
    }

    // ── Computed Pattern + Subset Pattern ───────────────────
    public void mettreAJourComputedPattern(String annonceId) {
        List<Avis> tousAvis = avisRepository.findByCibleIdAndCibleType(annonceId, "annonce");

        double moyenne = tousAvis.isEmpty() ? 0.0
                : tousAvis.stream().mapToInt(Avis::getNote).average().orElse(0.0);
        double arrondie = Math.round(moyenne * 10.0) / 10.0;

        // Subset Pattern : top 3 par note décroissante puis date décroissante
        List<Annonce.AvisEmbed> top3 = tousAvis.stream()
                .sorted(Comparator.comparingInt(Avis::getNote).reversed()
                        .thenComparing(Comparator.comparing(Avis::getCreatedAt).reversed()))
                .limit(3)
                .map(avis -> {
                    Annonce.AvisEmbed embed = new Annonce.AvisEmbed();
                    embed.setAuteurId(avis.getAuteurId());
                    embed.setNote(avis.getNote());
                    embed.setCommentaire(avis.getCommentaire());
                    embed.setCreatedAt(avis.getCreatedAt());
                    userRepository.findById(avis.getAuteurId()).ifPresent(u ->
                            embed.setAuteurNom(u.getName())
                    );
                    return embed;
                })
                .collect(Collectors.toList());

        Annonce annonce = findById(annonceId);
        annonce.setNoteMoyenne(arrondie);
        annonce.setNbAvis(tousAvis.size());
        annonce.setTopAvis(top3);
        annonceRepository.save(annonce);

        // Mise à jour avgRating de l'hôte
        mettreAJourAvgRatingHote(annonce.getHoteId());
    }

    private void mettreAJourAvgRatingHote(String hoteId) {
        List<Annonce> annoncesHote = annonceRepository.findByHoteId(hoteId);
        double avg = annoncesHote.stream()
                .filter(a -> a.getNbAvis() > 0)
                .mapToDouble(Annonce::getNoteMoyenne)
                .average()
                .orElse(0.0);

        userRepository.findById(hoteId).ifPresent(hote -> {
            hote.setAvgRating(Math.round(avg * 10.0) / 10.0);
            userRepository.save(hote);
        });
    }
}
