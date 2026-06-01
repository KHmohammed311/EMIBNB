package ma.airbnbclone.document;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "reservations")
public class Reservation {

    @Id
    private String id;

    @NotBlank(message = "L'identifiant de l'annonce est obligatoire")
    private String annonceId;

    @NotBlank(message = "L'identifiant du voyageur est obligatoire")
    private String voyageurId;

    @NotNull(message = "La date d'arrivée est obligatoire")
    private LocalDateTime dateArrivee;

    @NotNull(message = "La date de départ est obligatoire")
    private LocalDateTime dateDepart;

    @PositiveOrZero(message = "Le prix total doit être positif ou nul")
    private Double prixTotal;

    @Pattern(regexp = "en_attente|confirmee|annulee|terminee",
             message = "Statut invalide")
    private String statut = "en_attente";

    @Min(value = 1, message = "Au moins 1 voyageur requis")
    private Integer nbVoyageurs;

    private Double fraisAnnulation = 0.0;

    private LocalDateTime createdAt;
}
