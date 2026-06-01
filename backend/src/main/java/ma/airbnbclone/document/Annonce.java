package ma.airbnbclone.document;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "annonces")
@CompoundIndex(def = "{'localisation.ville': 1, 'prixParNuit': 1}")
public class Annonce {

    @Id
    private String id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, message = "Le titre doit contenir au moins 3 caractères")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    @Size(min = 10, message = "La description doit contenir au moins 10 caractères")
    private String description;

    @NotBlank(message = "L'identifiant de l'hôte est obligatoire")
    private String hoteId;

    @Pattern(regexp = "appartement|maison|chambre|villa",
             message = "Le type doit être : appartement, maison, chambre ou villa")
    private String type;

    @Positive(message = "Le prix par nuit doit être positif")
    private Double prixParNuit;

    @Min(value = 1, message = "Au moins 1 voyageur requis")
    private Integer maxVoyageurs;

    private List<String> photos;
    private List<String> equipements;

    @NotNull(message = "La localisation est obligatoire")
    private Localisation localisation;

    private Caracteristiques caracteristiques;
    private PolitiqueAnnulation politiqueAnnulation;

    @Indexed
    private Double noteMoyenne = 0.0;
    private Integer nbAvis = 0;
    private List<AvisEmbed> topAvis;

    // ── Embedded documents ──────────────────────────────────

    @Data
    public static class Localisation {
        @NotBlank(message = "La ville est obligatoire")
        private String ville;
        @NotBlank(message = "Le pays est obligatoire")
        private String pays;
        private List<Double> coordonnees;
    }

    @Data
    public static class Caracteristiques {
        private Boolean piscine;
        private Boolean parking;
        private Boolean wifi;
        private Boolean climatisation;
        private Boolean cuisine;
        private Boolean animaux;
        private Boolean jacuzzi;
    }

    @Data
    public static class PolitiqueAnnulation {
        @Pattern(regexp = "flexible|moderee|stricte",
                 message = "La politique doit être : flexible, moderee ou stricte")
        private String type;
        @Min(0)
        private Integer delaiRemboursement;
    }

    @Data
    public static class AvisEmbed {
        private String auteurId;
        private String auteurNom;
        private Integer note;
        private String commentaire;
        private LocalDateTime createdAt;
    }
}
