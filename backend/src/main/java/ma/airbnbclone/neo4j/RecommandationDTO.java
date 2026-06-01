package ma.airbnbclone.neo4j;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecommandationDTO {
    private String logementId;
    private String ville;
    private Double prixParNuit;
    private Long scoreCompatibilite;
    private List<String> caracteristiquesCommunes;
}
