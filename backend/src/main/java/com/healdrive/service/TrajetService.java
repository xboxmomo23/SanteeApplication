package com.healdrive.service;

import com.healdrive.dto.DashboardStats;
import com.healdrive.dto.CreateTrajetRequest;
import com.healdrive.dto.StatutUpdateRequest;
import com.healdrive.dto.TrajetResponse;
import com.healdrive.model.*;
import com.healdrive.model.enums.StatutTrajet;
import com.healdrive.model.enums.TypeVehicule;
import com.healdrive.model.enums.RoleUtilisateur;
import com.healdrive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import com.healdrive.model.enums.TypeNotification;

@Service
@RequiredArgsConstructor
public class TrajetService {

    private final TrajetRepository trajetRepository;
    private final ProfilPatientRepository profilPatientRepository;
    private final ProfilChauffeurRepository profilChauffeurRepository;
    private final VehiculeRepository vehiculeRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final HistoriqueStatutRepository historiqueStatutRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationService notificationService;

    // ===== LECTURE =====

    /**
     * Tous les trajets d'un patient, tries par date decroissante.
     */
    public List<TrajetResponse> getTrajetsPatient(UUID patientId) {
        List<Trajet> trajets = trajetRepository.findByPatientIdOrderByDateTrajetDesc(patientId);
        return trajets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Tous les trajets d'un chauffeur, tries par date decroissante.
     */
    public List<TrajetResponse> getTrajetsChauffeur(UUID chauffeurId) {
        List<Trajet> trajets = trajetRepository.findByChauffeurIdOrderByDateTrajetDesc(chauffeurId);
        return trajets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Courses actives (ACCEPTE + EN_COURS) d'un chauffeur.
     */
    public List<TrajetResponse> getTrajetsActifsChauffeur(UUID chauffeurId) {
        List<Trajet> trajets = trajetRepository.findActiveByChauffeurId(chauffeurId);
        return trajets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Courses EN_ATTENTE disponibles pour un type de vehicule donne.
     * Utilise par le Smart Matching cote chauffeur.
     */
    public List<TrajetResponse> getTrajetsDisponibles(String typeVehicule) {
        TypeVehicule type = TypeVehicule.valueOf(typeVehicule);
        List<Trajet> trajets = trajetRepository.findAvailableForMatching(type, LocalDate.now());
        return trajets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Tous les trajets EN_ATTENTE (sans filtre de vehicule).
     */
    public List<TrajetResponse> getAllTrajetsDisponibles() {
        List<Trajet> trajets = trajetRepository.findByStatut(StatutTrajet.EN_ATTENTE);
        return trajets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Detail d'un trajet par son ID.
     */
    public TrajetResponse getTrajet(UUID trajetId) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable : " + trajetId));
        return toResponse(trajet);
    }

    /**
     * Tous les trajets pour la vue admin.
     */
    public List<TrajetResponse> getTousTrajetsAdmin() {
        return trajetRepository.findAll(Sort.by(Sort.Direction.DESC, "dateCreation"))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Stats pour le dashboard patient ou chauffeur.
     */
    public DashboardStats getStatsPatient(UUID patientId) {
        return DashboardStats.builder()
                .enAttente(trajetRepository.countByPatientIdAndStatut(patientId, StatutTrajet.EN_ATTENTE))
                .accepte(trajetRepository.countByPatientIdAndStatut(patientId, StatutTrajet.ACCEPTE))
                .enCours(trajetRepository.countByPatientIdAndStatut(patientId, StatutTrajet.EN_COURS))
                .termine(trajetRepository.countByPatientIdAndStatut(patientId, StatutTrajet.TERMINE))
                .annule(trajetRepository.countByPatientIdAndStatut(patientId, StatutTrajet.ANNULE))
                .total(trajetRepository.findByPatientIdOrderByDateTrajetDesc(patientId).size())
                .build();
    }

    public DashboardStats getStatsChauffeur(UUID chauffeurId) {
        return DashboardStats.builder()
                .enAttente(trajetRepository.countByChauffeurIdAndStatut(chauffeurId, StatutTrajet.EN_ATTENTE))
                .accepte(trajetRepository.countByChauffeurIdAndStatut(chauffeurId, StatutTrajet.ACCEPTE))
                .enCours(trajetRepository.countByChauffeurIdAndStatut(chauffeurId, StatutTrajet.EN_COURS))
                .termine(trajetRepository.countByChauffeurIdAndStatut(chauffeurId, StatutTrajet.TERMINE))
                .annule(trajetRepository.countByChauffeurIdAndStatut(chauffeurId, StatutTrajet.ANNULE))
                .total(trajetRepository.findByChauffeurIdOrderByDateTrajetDesc(chauffeurId).size())
                .build();
    }

    // ===== ECRITURE =====

    /**
     * Creer un trajet EN_ATTENTE pour un patient.
     */
    @Transactional
    public TrajetResponse createTrajet(CreateTrajetRequest request) {
        ProfilPatient patient = profilPatientRepository.findById(request.getPatientId())
                .or(() -> profilPatientRepository.findByUtilisateurId(request.getPatientId()))
                .orElseGet(() -> {
                    Utilisateur user = utilisateurRepository.findById(request.getPatientId())
                            .orElseThrow(() -> new RuntimeException("Patient introuvable : " + request.getPatientId()));
                    if (user.getRole() != RoleUtilisateur.PATIENT) {
                        throw new RuntimeException("L'utilisateur n'est pas un patient : " + request.getPatientId());
                    }
                    return profilPatientRepository.save(ProfilPatient.builder()
                            .utilisateur(user)
                            .numeroSecu(("TMP" + user.getId().toString().replace("-", "")).substring(0, 21))
                            .regime("Regime general")
                            .build());
                });

        Prescription prescription = prescriptionRepository.findValidPrescriptions(patient.getId(), LocalDate.now())
                .stream()
                .findFirst()
                .orElseGet(() -> prescriptionRepository.save(
                        Prescription.builder()
                                .patient(patient)
                                .medecinPrescripteur("Dr. Temporaire")
                                .etablissement("Etablissement non renseigne")
                                .typeTransportRequis(TypeVehicule.valueOf(request.getTypeVehicule()))
                                .motif("Transport medical")
                                .dateEmission(LocalDate.now())
                                .dateValidite(LocalDate.now().plusMonths(3))
                                .validee(true)
                                .build()
                ));

        Trajet trajet = Trajet.builder()
                .patient(patient)
                .prescription(prescription)
                .departAdresse(request.getDepart())
                .destinationAdresse(request.getDestination())
                .dateTrajet(LocalDate.parse(request.getDate()))
                .heureTrajet(LocalTime.parse(request.getHeure()))
                .typeVehicule(TypeVehicule.valueOf(request.getTypeVehicule()))
                .statut(StatutTrajet.EN_ATTENTE)
                .build();

        trajet = trajetRepository.save(trajet);
        return toResponse(trajet);
    }

    /**
     * Changer le statut d'un trajet.
     * Gere les transitions : EN_ATTENTE -> ACCEPTE -> EN_COURS -> TERMINE
     */
    @Transactional
    public TrajetResponse updateStatut(UUID trajetId, StatutUpdateRequest request) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable : " + trajetId));

        StatutTrajet ancienStatut = trajet.getStatut();
        StatutTrajet nouveauStatut = StatutTrajet.valueOf(request.getNouveauStatut());

        // Validation des transitions
        validateTransition(ancienStatut, nouveauStatut);

        // Appliquer le changement
        trajet.setStatut(nouveauStatut);

        switch (nouveauStatut) {
            case ACCEPTE -> {
                if (request.getChauffeurId() == null) {
                    throw new RuntimeException("chauffeurId requis pour accepter une course.");
                }
                ProfilChauffeur chauffeur = profilChauffeurRepository.findById(request.getChauffeurId())
                        .or(() -> profilChauffeurRepository.findByUtilisateurId(request.getChauffeurId()))
                        .orElseThrow(() -> new RuntimeException("Chauffeur introuvable : " + request.getChauffeurId()));
                trajet.setChauffeur(chauffeur);
                trajet.setDateAcceptation(OffsetDateTime.now());

                // Assigner le vehicule actif du chauffeur
                vehiculeRepository.findByChauffeurIdAndActifTrue(chauffeur.getId())
                        .ifPresent(trajet::setVehicule);
            }
            case EN_COURS -> {
                trajet.setDateDebut(OffsetDateTime.now());
            }
            case TERMINE -> {
                trajet.setDateFin(OffsetDateTime.now());
            }
            case ANNULE -> {
                trajet.setMotifAnnulation(request.getCommentaire());
            }
            default -> {}
        }

        trajetRepository.save(trajet);

        UUID patientUserId = trajet.getPatient() != null && trajet.getPatient().getUtilisateur() != null
                ? trajet.getPatient().getUtilisateur().getId()
                : null;

        if (patientUserId != null) {
            switch (nouveauStatut) {
                case ACCEPTE -> notificationService.creerNotification(
                        patientUserId,
                        TypeNotification.COURSE_ACCEPTEE,
                        "Course acceptee",
                        "Votre course a ete acceptee par un chauffeur.",
                        trajet
                );
                case EN_COURS -> notificationService.creerNotification(
                        patientUserId,
                        TypeNotification.COURSE_DEMARREE,
                        "Course demarree",
                        "Votre course vient de demarrer.",
                        trajet
                );
                case TERMINE -> notificationService.creerNotification(
                        patientUserId,
                        TypeNotification.COURSE_TERMINEE,
                        "Course terminee",
                        "Votre course est terminee.",
                        trajet
                );
                default -> {
                }
            }
        }

        // Historique
        UUID modifiePar = request.getChauffeurId();
        if (modifiePar == null && trajet.getPatient() != null) {
            modifiePar = trajet.getPatient().getUtilisateur().getId();
        }

        HistoriqueStatut historique = HistoriqueStatut.builder()
                .trajet(trajet)
                .ancienStatut(ancienStatut)
                .nouveauStatut(nouveauStatut)
                .commentaire(request.getCommentaire())
                .build();

        if (modifiePar != null) {
            utilisateurRepository.findById(modifiePar)
                    .ifPresent(historique::setModifiePar);
        }

        historiqueStatutRepository.save(historique);

        return toResponse(trajet);
    }

    /**
     * Annuler un trajet (patient uniquement, si EN_ATTENTE).
     */
    @Transactional
    public void annulerTrajet(UUID trajetId, UUID patientUtilisateurId) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable : " + trajetId));

        if (trajet.getStatut() != StatutTrajet.EN_ATTENTE) {
            throw new RuntimeException("Seuls les trajets EN_ATTENTE peuvent etre annules.");
        }

        trajet.setStatut(StatutTrajet.ANNULE);
        trajet.setMotifAnnulation("Annule par le patient");
        trajetRepository.save(trajet);

        HistoriqueStatut historique = HistoriqueStatut.builder()
                .trajet(trajet)
                .ancienStatut(StatutTrajet.EN_ATTENTE)
                .nouveauStatut(StatutTrajet.ANNULE)
                .commentaire("Annule par le patient")
                .build();

        utilisateurRepository.findById(patientUtilisateurId)
                .ifPresent(historique::setModifiePar);

        historiqueStatutRepository.save(historique);
    }

    // ===== HELPERS =====

    private void validateTransition(StatutTrajet ancien, StatutTrajet nouveau) {
        boolean valid = switch (ancien) {
            case EN_ATTENTE -> nouveau == StatutTrajet.ACCEPTE || nouveau == StatutTrajet.ANNULE;
            case ACCEPTE -> nouveau == StatutTrajet.EN_COURS || nouveau == StatutTrajet.ANNULE;
            case EN_COURS -> nouveau == StatutTrajet.TERMINE;
            case TERMINE, ANNULE -> false;
        };

        if (!valid) {
            throw new RuntimeException(
                    "Transition invalide : " + ancien + " -> " + nouveau);
        }
    }

    /**
     * Convertit une entite Trajet en DTO TrajetResponse.
     */
    private TrajetResponse toResponse(Trajet t) {
        TrajetResponse.TrajetResponseBuilder builder = TrajetResponse.builder()
                .id(t.getId())
                .departAdresse(t.getDepartAdresse())
                .departLat(t.getDepartLat())
                .departLng(t.getDepartLng())
                .destinationAdresse(t.getDestinationAdresse())
                .destinationLat(t.getDestinationLat())
                .destinationLng(t.getDestinationLng())
                .dateTrajet(t.getDateTrajet())
                .heureTrajet(t.getHeureTrajet())
                .typeVehicule(t.getTypeVehicule().name())
                .statut(t.getStatut().name())
                .distanceKm(t.getDistanceKm())
                .dureeEstimeeMin(t.getDureeEstimeeMin())
                .prixEstime(t.getPrixEstime())
                .prixFinal(t.getPrixFinal())
                .notesPatient(t.getNotesPatient())
                .notesChauffeur(t.getNotesChauffeur())
                .dateAcceptation(t.getDateAcceptation())
                .dateDebut(t.getDateDebut())
                .dateFin(t.getDateFin())
                .dateCreation(t.getDateCreation());

        // Patient
        if (t.getPatient() != null) {
            builder.patientId(t.getPatient().getId());
            Utilisateur pu = t.getPatient().getUtilisateur();
            if (pu != null) {
                builder.patientNom(pu.getNom())
                       .patientPrenom(pu.getPrenom())
                       .patientTelephone(pu.getTelephone());
            }
            builder.patientAdresse(t.getPatient().getAdresse());
        }

        // Chauffeur
        if (t.getChauffeur() != null) {
            builder.chauffeurId(t.getChauffeur().getId());
            Utilisateur cu = t.getChauffeur().getUtilisateur();
            if (cu != null) {
                builder.chauffeurNom(cu.getNom())
                       .chauffeurPrenom(cu.getPrenom())
                       .chauffeurTelephone(cu.getTelephone());
            }
        }

        // Vehicule
        if (t.getVehicule() != null) {
            builder.vehiculeId(t.getVehicule().getId())
                   .vehiculeMarque(t.getVehicule().getMarque())
                   .vehiculeModele(t.getVehicule().getModele())
                   .vehiculeImmatriculation(t.getVehicule().getImmatriculation());
        }

        // Prescription
        if (t.getPrescription() != null) {
            Prescription p = t.getPrescription();
            builder.prescriptionId(p.getId())
                   .medecinPrescripteur(p.getMedecinPrescripteur())
                   .etablissement(p.getEtablissement())
                   .motifPrescription(p.getMotif())
                   .prescriptionDateValidite(p.getDateValidite())
                   .prescriptionFichierUrl(p.getFichierUrl());
        }

        return builder.build();
    }
}
