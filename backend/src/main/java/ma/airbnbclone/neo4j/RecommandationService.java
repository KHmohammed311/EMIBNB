package ma.airbnbclone.neo4j;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Annonce;
import ma.airbnbclone.document.User;
import ma.airbnbclone.exception.ResourceNotFoundException;
import ma.airbnbclone.repository.AnnonceRepository;
import ma.airbnbclone.repository.UserRepository;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommandationService {

    private final Neo4jClient neo4jClient;
    private final AnnonceRepository annonceRepository;
    private final UserRepository userRepository;

    public List<RecommandationDTO> recommander(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + userId));

        String cypher = """
            MATCH (v:Voyageur { userId: $userId })-[p:PREFERE]->(c:Caracteristique)
            MATCH (l:Logement)-[:POSSEDE]->(c)
            WHERE NOT (v)-[:A_SEJOURNE]->(l)
              AND l.prixParNuit <= v.budget
            WITH l, sum(p.poids) AS score, collect(c.nom) AS caracteristiquesCommunes
            ORDER BY score DESC
            RETURN
              l.annonceId           AS logementId,
              l.ville               AS ville,
              l.prixParNuit         AS prixParNuit,
              score                 AS scoreCompatibilite,
              caracteristiquesCommunes
            LIMIT 5
            """;

        return neo4jClient.query(cypher)
                .bind(userId).to("userId")
                .fetch()
                .all()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<RecommandationDTO> logementsSimilaires(String annonceId) {
        String cypher = """
            MATCH (l1:Logement { annonceId: $annonceId })-[:POSSEDE]->(c:Caracteristique)
            MATCH (l2:Logement)-[:POSSEDE]->(c)
            WHERE l1 <> l2
            WITH l2, collect(c.nom) AS communes, count(c) AS nbCommunes
            WHERE nbCommunes >= 2
            ORDER BY nbCommunes DESC
            RETURN
              l2.annonceId         AS logementId,
              l2.ville             AS ville,
              l2.prixParNuit       AS prixParNuit,
              nbCommunes           AS scoreCompatibilite,
              communes             AS caracteristiquesCommunes
            LIMIT 5
            """;

        return neo4jClient.query(cypher)
                .bind(annonceId).to("annonceId")
                .fetch()
                .all()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private RecommandationDTO mapToDTO(Map<String, Object> row) {
        RecommandationDTO dto = new RecommandationDTO();
        dto.setLogementId((String) row.get("logementId"));
        dto.setVille((String) row.get("ville"));
        dto.setPrixParNuit(((Number) row.get("prixParNuit")).doubleValue());
        dto.setScoreCompatibilite(((Number) row.get("scoreCompatibilite")).longValue());
        dto.setCaracteristiquesCommunes((List<String>) row.get("caracteristiquesCommunes"));

        // Enrichir avec les données MongoDB (titre de l'annonce)
        Optional<Annonce> annonce = annonceRepository.findById(dto.getLogementId());
        annonce.ifPresent(a -> {
            // Le titre est disponible via l'annonce MongoDB
            // On pourrait l'ajouter au DTO si besoin
        });

        return dto;
    }
}
