package ma.airbnbclone.neo4j;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.airbnbclone.document.Annonce;
import ma.airbnbclone.document.User;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Maintient la cohérence entre MongoDB et Neo4j.
 * Appelé automatiquement par AnnonceService, UserService et ReservationService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class Neo4jSyncService {

    private final Neo4jClient neo4jClient;

    // ── Annonce → Logement ───────────────────────────────────

    public void syncAnnonce(Annonce annonce) {
        if (annonce.getId() == null || annonce.getLocalisation() == null) return;

        // 1. Créer/mettre à jour le nœud Logement
        neo4jClient.query("""
                MERGE (l:Logement {annonceId: $annonceId})
                SET l.ville       = $ville,
                    l.prixParNuit = $prix,
                    l.titre       = $titre
                """)
            .bind(annonce.getId()).to("annonceId")
            .bind(annonce.getLocalisation().getVille()).to("ville")
            .bind(annonce.getPrixParNuit()).to("prix")
            .bind(annonce.getTitre()).to("titre")
            .run();

        // 2. Supprimer les anciennes relations POSSEDE (pour les mises à jour)
        neo4jClient.query("""
                MATCH (l:Logement {annonceId: $annonceId})-[r:POSSEDE]->(:Caracteristique)
                DELETE r
                """)
            .bind(annonce.getId()).to("annonceId")
            .run();

        // 3. Recréer les relations POSSEDE selon les caracteristiques actives
        List<String> actives = caracteristiquesActives(annonce.getCaracteristiques());
        for (String nom : actives) {
            neo4jClient.query("""
                    MATCH (l:Logement {annonceId: $annonceId})
                    MERGE (c:Caracteristique {nom: $nom})
                    MERGE (l)-[:POSSEDE]->(c)
                    """)
                .bind(annonce.getId()).to("annonceId")
                .bind(nom).to("nom")
                .run();
        }

        log.info("Neo4j sync — Logement {} ({} caractéristiques)", annonce.getId(), actives.size());
    }

    public void deleteAnnonce(String annonceId) {
        neo4jClient.query("""
                MATCH (l:Logement {annonceId: $annonceId})
                DETACH DELETE l
                """)
            .bind(annonceId).to("annonceId")
            .run();
        log.info("Neo4j sync — Logement {} supprimé", annonceId);
    }

    // ── User → Voyageur ──────────────────────────────────────

    public void syncVoyageur(User user) {
        if (!"voyageur".equals(user.getRole()) || user.getId() == null) return;

        neo4jClient.query("""
                MERGE (v:Voyageur {userId: $userId})
                SET v.nom    = $nom,
                    v.budget = $budget
                """)
            .bind(user.getId()).to("userId")
            .bind(user.getName()).to("nom")
            .bind(500.0).to("budget")   // budget par défaut en MAD
            .run();

        log.info("Neo4j sync — Voyageur {} créé/mis à jour", user.getId());
    }

    // ── Reservation terminée → A_SEJOURNE ───────────────────

    public void syncSejour(String voyageurId, String annonceId) {
        neo4jClient.query("""
                MATCH (v:Voyageur {userId: $voyageurId})
                MATCH (l:Logement {annonceId: $annonceId})
                MERGE (v)-[:A_SEJOURNE]->(l)
                """)
            .bind(voyageurId).to("voyageurId")
            .bind(annonceId).to("annonceId")
            .run();
        log.info("Neo4j sync — A_SEJOURNE {} → {}", voyageurId, annonceId);
    }

    // ── Helpers ──────────────────────────────────────────────

    private List<String> caracteristiquesActives(Annonce.Caracteristiques c) {
        List<String> liste = new ArrayList<>();
        if (c == null) return liste;
        if (Boolean.TRUE.equals(c.getPiscine()))       liste.add("piscine");
        if (Boolean.TRUE.equals(c.getParking()))       liste.add("parking");
        if (Boolean.TRUE.equals(c.getWifi()))          liste.add("wifi");
        if (Boolean.TRUE.equals(c.getClimatisation())) liste.add("climatisation");
        if (Boolean.TRUE.equals(c.getCuisine()))       liste.add("cuisine");
        if (Boolean.TRUE.equals(c.getAnimaux()))       liste.add("animaux");
        if (Boolean.TRUE.equals(c.getJacuzzi()))       liste.add("jacuzzi");
        return liste;
    }
}
