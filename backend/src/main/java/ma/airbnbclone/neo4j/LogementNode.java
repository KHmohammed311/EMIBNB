package ma.airbnbclone.neo4j;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;

@Node("Logement")
@Data
public class LogementNode {

    @Id @GeneratedValue
    private Long id;

    private String annonceId;
    private String ville;
    private Double prixParNuit;
    private Boolean piscine;
    private Boolean parking;
    private Boolean wifi;
    private Boolean climatisation;
    private Boolean cuisine;
    private Boolean animaux;
    private Boolean jacuzzi;

    @Relationship(type = "POSSEDE", direction = Relationship.Direction.OUTGOING)
    private List<CaracteristiqueNode> caracteristiques;
}
