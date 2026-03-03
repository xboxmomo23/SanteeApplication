package com.healdrive.service;

import com.healdrive.dto.LoginRequest;
import com.healdrive.dto.LoginResponse;
import com.healdrive.dto.RegisterRequest;
import com.healdrive.model.Utilisateur;
import com.healdrive.model.enums.RoleUtilisateur;
import com.healdrive.repository.ProfilChauffeurRepository;
import com.healdrive.repository.ProfilPatientRepository;
import com.healdrive.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ProfilPatientRepository profilPatientRepository;
    private final ProfilChauffeurRepository profilChauffeurRepository;

    /**
     * Login simplifie pour le MVP.
     * En production : Spring Security + JWT + BCrypt.
     * Ici on verifie juste que l'email existe et on renvoie les infos.
     */
    public LoginResponse login(LoginRequest request) {
        Utilisateur user = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'email : " + request.getEmail()));

        if (!user.getActif()) {
            throw new RuntimeException("Ce compte est desactive.");
        }

        // Recuperer l'ID du profil selon le role
        UUID profilId = null;
        if (user.getRole() == RoleUtilisateur.PATIENT) {
            profilId = profilPatientRepository.findByUtilisateurId(user.getId())
                    .map(p -> p.getId())
                    .orElse(null);
        } else if (user.getRole() == RoleUtilisateur.CHAUFFEUR) {
            profilId = profilChauffeurRepository.findByUtilisateurId(user.getId())
                    .map(p -> p.getId())
                    .orElse(null);
        }

        return LoginResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .telephone(user.getTelephone())
                .role(user.getRole().name())
                .profilId(profilId)
                .build();
    }

    /**
     * Inscription utilisateur.
     */
    public LoginResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Un compte existe deja avec cet email.");
        }

        RoleUtilisateur role = RoleUtilisateur.valueOf(request.getRole().trim().toUpperCase(Locale.ROOT));

        Utilisateur user = Utilisateur.builder()
                .id(UUID.randomUUID())
                .email(request.getEmail().trim())
                .motDePasse(request.getMotDePasse())
                .nom(request.getNom().trim())
                .prenom(request.getPrenom().trim())
                .telephone(request.getTelephone())
                .role(role)
                .actif(true)
                .build();

        Utilisateur saved = utilisateurRepository.save(user);

        return LoginResponse.builder()
                .id(saved.getId())
                .email(saved.getEmail())
                .nom(saved.getNom())
                .prenom(saved.getPrenom())
                .telephone(saved.getTelephone())
                .role(saved.getRole().name())
                .profilId(null)
                .build();
    }

    /**
     * Recuperer un utilisateur par son ID.
     */
    public Utilisateur getUtilisateur(UUID id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + id));
    }
}
