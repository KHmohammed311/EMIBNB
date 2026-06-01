package ma.airbnbclone.document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format email invalide")
    @Indexed(unique = true)
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String passwordHash;

    @Pattern(regexp = "hote|voyageur", message = "Le rôle doit être 'hote' ou 'voyageur'")
    private String role;

    private String avatar;
    private List<String> languages;
    private LocalDateTime memberSince;
    private Double avgRating;
}
