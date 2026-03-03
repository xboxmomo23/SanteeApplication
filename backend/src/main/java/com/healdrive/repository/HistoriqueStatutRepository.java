package com.healdrive.repository;

import com.healdrive.model.HistoriqueStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HistoriqueStatutRepository extends JpaRepository<HistoriqueStatut, UUID> {
    List<HistoriqueStatut> findByTrajetIdOrderByDateCreationAsc(UUID trajetId);
}
