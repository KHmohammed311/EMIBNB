package ma.airbnbclone.service;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Avis;
import ma.airbnbclone.exception.ResourceNotFoundException;
import ma.airbnbclone.repository.ActiviteRepository;
import ma.airbnbclone.repository.AvisRepository;
import ma.airbnbclone.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvisService {

    private final AvisRepository avisRepository;
    private final AnnonceService annonceService;
    private final ActiviteService activiteService;
    private final UserRepository userRepository;

    public List<Avis> findByCible(String cibleType, String cibleId) {
        return avisRepository.findByCibleIdAndCibleType(cibleId, cibleType);
    }

    public Avis creer(Avis avis) {
        // Auto-remplir auteurNom si non fourni
        if ((avis.getAuteurNom() == null || avis.getAuteurNom().isBlank()) && avis.getAuteurId() != null) {
            userRepository.findById(avis.getAuteurId())
                    .ifPresent(u -> avis.setAuteurNom(u.getName()));
        }
        avis.setCreatedAt(LocalDateTime.now());
        Avis sauvegarde = avisRepository.save(avis);

        // Déclenchement automatique du Computed Pattern + Subset Pattern
        if ("annonce".equals(avis.getCibleType())) {
            annonceService.mettreAJourComputedPattern(avis.getCibleId());
        } else if ("activite".equals(avis.getCibleType())) {
            activiteService.mettreAJourNoteMoyenne(avis.getCibleId());
        }

        return sauvegarde;
    }

    public void supprimer(String id) {
        Avis avis = avisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avis introuvable : " + id));
        avisRepository.deleteById(id);

        // Recalcul après suppression
        if ("annonce".equals(avis.getCibleType())) {
            annonceService.mettreAJourComputedPattern(avis.getCibleId());
        } else if ("activite".equals(avis.getCibleType())) {
            activiteService.mettreAJourNoteMoyenne(avis.getCibleId());
        }
    }
}
