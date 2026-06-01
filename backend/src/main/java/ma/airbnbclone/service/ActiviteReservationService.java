package ma.airbnbclone.service;

import lombok.RequiredArgsConstructor;
import ma.airbnbclone.document.Activite;
import ma.airbnbclone.document.ActiviteReservation;
import ma.airbnbclone.exception.ResourceNotFoundException;
import ma.airbnbclone.repository.ActiviteRepository;
import ma.airbnbclone.repository.ActiviteReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActiviteReservationService {

    private final ActiviteReservationRepository activiteReservationRepository;
    private final ActiviteRepository activiteRepository;

    public List<ActiviteReservation> findAll() {
        return activiteReservationRepository.findAll();
    }

    public ActiviteReservation creer(ActiviteReservation reservation) {
        Activite activite = activiteRepository.findById(reservation.getActiviteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Activité introuvable : " + reservation.getActiviteId()));

        if (reservation.getNbParticipants() > activite.getMaxParticipants()) {
            throw new IllegalArgumentException(
                    "Nombre de participants (" + reservation.getNbParticipants() +
                    ") dépasse le maximum (" + activite.getMaxParticipants() + ")");
        }

        reservation.setPrixTotal(reservation.getNbParticipants() * activite.getPrix());
        reservation.setStatut("en_attente");
        return activiteReservationRepository.save(reservation);
    }

    public ActiviteReservation changerStatut(String id, String nouveauStatut) {
        ActiviteReservation reservation = activiteReservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation introuvable : " + id));
        reservation.setStatut(nouveauStatut);
        return activiteReservationRepository.save(reservation);
    }
}
