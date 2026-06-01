package ma.airbnbclone.neo4j;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("Caracteristique")
@Data
public class CaracteristiqueNode {

    @Id @GeneratedValue
    private Long id;

    private String nom;
}
