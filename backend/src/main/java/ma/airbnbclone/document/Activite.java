package ma.airbnbclone.document;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "activites")
public class Activite {

    @Id
    private String id;

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, message = "Le titre doit contenir au moins 3 caractères")
    private String titre;

    @NotBlank(message = "L'identifiant de l'hôte est obligatoire")
    private String hoteId;

    @NotBlank(message = "La ville est obligatoire")
    private String ville;

    @PositiveOrZero(message = "Le prix doit être positif ou nul")
    private Double prix;

    @Min(value = 1, message = "La durée minimale est 1 minute")
    private Integer duree;

    @Min(value = 1, message = "Au moins 1 participant requis")
    private Integer maxParticipants;

    @NotBlank(message = "La catégorie est obligatoire")
    private String categorie;

    private List<String> photos;
    private Double noteMoyenne = 0.0;
}
