package ma.airbnbclone.document;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "avis")
public class Avis {

    @Id
    private String id;

    @NotBlank(message = "L'identifiant de la cible est obligatoire")
    private String cibleId;

    @Pattern(regexp = "annonce|activite", message = "Le type de cible doit être 'annonce' ou 'activite'")
    private String cibleType;

    @NotBlank(message = "L'identifiant de l'auteur est obligatoire")
    private String auteurId;

    @NotBlank(message = "L'identifiant de la réservation est obligatoire")
    private String reservationId;

    @Min(value = 1, message = "La note minimale est 1")
    @Max(value = 5, message = "La note maximale est 5")
    private Integer note;

    @NotBlank(message = "Le commentaire est obligatoire")
    @Size(min = 5, message = "Le commentaire doit contenir au moins 5 caractères")
    private String commentaire;

    private LocalDateTime createdAt;
}
