package ma.airbnbclone.service;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Activite;
import ma.airbnbclone.document.Avis;
import ma.airbnbclone.exception.ResourceNotFoundException;
import ma.airbnbclone.repository.ActiviteRepository;
import ma.airbnbclone.repository.AvisRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActiviteService {

    private final ActiviteRepository activiteRepository;
    private final AvisRepository avisRepository;

    public List<Activite> rechercherActivites(String ville, String categorie) {
        if (ville != null && categorie != null) {
            return activiteRepository.findByVilleAndCategorie(ville, categorie);
        } else if (ville != null) {
            return activiteRepository.findByVille(ville);
        } else if (categorie != null) {
            return activiteRepository.findByCategorie(categorie);
        }
        return activiteRepository.findAll();
    }

    public Activite findById(String id) {
        return activiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activité introuvable : " + id));
    }

    public Activite creer(Activite activite) {
        activite.setNoteMoyenne(0.0);
        return activiteRepository.save(activite);
    }

    public Activite modifier(String id, Activite données) {
        Activite existante = findById(id);
        données.setId(existante.getId());
        données.setNoteMoyenne(existante.getNoteMoyenne());
        return activiteRepository.save(données);
    }

    public void supprimer(String id) {
        if (!activiteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Activité introuvable : " + id);
        }
        activiteRepository.deleteById(id);
    }

    public void mettreAJourNoteMoyenne(String activiteId) {
        List<Avis> tousAvis = avisRepository.findByCibleIdAndCibleType(activiteId, "activite");
        double moyenne = tousAvis.isEmpty() ? 0.0
                : tousAvis.stream().mapToInt(Avis::getNote).average().orElse(0.0);

        activiteRepository.findById(activiteId).ifPresent(act -> {
            act.setNoteMoyenne(Math.round(moyenne * 10.0) / 10.0);
            activiteRepository.save(act);
        });
    }
}
