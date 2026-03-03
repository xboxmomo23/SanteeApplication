package com.healdrive.repository;

import com.healdrive.model.ProfilPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfilPatientRepository extends JpaRepository<ProfilPatient, UUID> {
    Optional<ProfilPatient> findByUtilisateurId(UUID utilisateurId);
    Optional<ProfilPatient> findByNumeroSecu(String numeroSecu);
}
