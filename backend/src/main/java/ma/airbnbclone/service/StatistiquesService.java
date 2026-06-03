package ma.airbnbclone.service;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatistiquesService {
    private final MongoTemplate mongo;

    /** Prix moyen, min, max par ville */
    public List<Map<String, Object>> prixParVille() {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.group("localisation.ville")
                .avg("prixParNuit").as("prixMoyen")
                .min("prixParNuit").as("prixMin")
                .max("prixParNuit").as("prixMax")
                .count().as("nbAnnonces"),
            Aggregation.project("prixMoyen","prixMin","prixMax","nbAnnonces")
                .and("_id").as("ville"),
            Aggregation.sort(Sort.Direction.DESC, "prixMoyen")
        );
        return mongo.aggregate(agg, "annonces", Document.class)
                .getMappedResults().stream()
                .map(d -> (Map<String,Object>) new LinkedHashMap<>(d))
                .collect(Collectors.toList());
    }

    /** Top 5 annonces mieux notées */
    public List<Map<String, Object>> topAnnonces() {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("nbAvis").gt(0)),
            Aggregation.sort(Sort.Direction.DESC, "noteMoyenne"),
            Aggregation.limit(5),
            Aggregation.project("titre","type","prixParNuit","noteMoyenne","nbAvis")
                .and("localisation.ville").as("ville")
        );
        return mongo.aggregate(agg, "annonces", Document.class)
                .getMappedResults().stream()
                .map(d -> (Map<String,Object>) new LinkedHashMap<>(d))
                .collect(Collectors.toList());
    }

    /** Réservations par statut (count + revenu) */
    public List<Map<String, Object>> reservationsParStatut() {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.group("statut")
                .count().as("total")
                .sum("prixTotal").as("revenuTotal"),
            Aggregation.project("total","revenuTotal").and("_id").as("statut"),
            Aggregation.sort(Sort.Direction.DESC, "total")
        );
        return mongo.aggregate(agg, "reservations", Document.class)
                .getMappedResults().stream()
                .map(d -> (Map<String,Object>) new LinkedHashMap<>(d))
                .collect(Collectors.toList());
    }

    /** Stats personnelles d'un hôte */
    public Map<String, Object> statsHote(String hoteId) {
        // Récupérer les annonces de cet hôte
        Aggregation annAgg = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("hoteId").is(hoteId)),
            Aggregation.group()
                .count().as("nbAnnonces")
                .avg("noteMoyenne").as("noteMoyenne")
                .avg("prixParNuit").as("prixMoyen")
        );
        List<Document> annRes = mongo.aggregate(annAgg, "annonces", Document.class).getMappedResults();

        // Récupérer IDs annonces de cet hôte
        List<String> annonceIds = mongo.getCollection("annonces")
            .find(new Document("hoteId", hoteId))
            .projection(new Document("_id", 1))
            .into(new ArrayList<>()).stream()
            .map(d -> d.getObjectId("_id").toHexString())
            .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        if (!annRes.isEmpty()) {
            Document d = annRes.get(0);
            result.put("nbAnnonces", d.get("nbAnnonces"));
            result.put("noteMoyenne", d.get("noteMoyenne") != null ?
                Math.round(((Number)d.get("noteMoyenne")).doubleValue() * 10.0) / 10.0 : 0);
            result.put("prixMoyen", d.get("prixMoyen") != null ?
                Math.round(((Number)d.get("prixMoyen")).doubleValue()) : 0);
        }

        if (!annonceIds.isEmpty()) {
            Aggregation revAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("annonceId").in(annonceIds)
                    .and("statut").in("confirmee","terminee")),
                Aggregation.group()
                    .count().as("nbReservations")
                    .sum("prixTotal").as("revenuTotal")
            );
            List<Document> revRes = mongo.aggregate(revAgg, "reservations", Document.class).getMappedResults();
            if (!revRes.isEmpty()) {
                Document d = revRes.get(0);
                result.put("nbReservations", d.get("nbReservations"));
                result.put("revenuTotal", d.get("revenuTotal") != null ?
                    Math.round(((Number)d.get("revenuTotal")).doubleValue()) : 0);
            } else {
                result.put("nbReservations", 0);
                result.put("revenuTotal", 0);
            }
        } else {
            result.put("nbReservations", 0);
            result.put("revenuTotal", 0);
        }
        return result;
    }

    /** Revenus mensuels (confirmée + terminée) */
    public List<Map<String, Object>> revenusMensuels() {
        Aggregation agg = Aggregation.newAggregation(
            Aggregation.match(Criteria.where("statut").in("confirmee","terminee")),
            Aggregation.project("prixTotal")
                .andExpression("year(dateArrivee)").as("annee")
                .andExpression("month(dateArrivee)").as("mois"),
            Aggregation.group("annee","mois")
                .sum("prixTotal").as("revenu")
                .count().as("nbReservations"),
            Aggregation.sort(Sort.Direction.ASC, "annee", "mois")
        );
        return mongo.aggregate(agg, "reservations", Document.class)
                .getMappedResults().stream()
                .map(d -> (Map<String,Object>) new LinkedHashMap<>(d))
                .collect(Collectors.toList());
    }
}
