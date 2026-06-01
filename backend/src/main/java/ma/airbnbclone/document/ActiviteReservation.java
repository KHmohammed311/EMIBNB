package ma.airbnbclone.document;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "activite_reservations")
public class ActiviteReservation {

    @Id
    private String id;

    @NotBlank(message = "L'identifiant de l'activité est obligatoire")
    private String activiteId;

    @NotBlank(message = "L'identifiant du voyageur est obligatoire")
    private String voyageurId;

    @NotNull(message = "La date est obligatoire")
    private LocalDateTime date;

    @Min(value = 1, message = "Au moins 1 participant requis")
    private Integer nbParticipants;

    @PositiveOrZero
    private Double prixTotal;

    @Pattern(regexp = "en_attente|confirmee|annulee", message = "Statut invalide")
    private String statut = "en_attente";
}
