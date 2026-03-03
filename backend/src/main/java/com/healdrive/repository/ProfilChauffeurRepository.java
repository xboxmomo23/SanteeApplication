package com.healdrive.repository;

import com.healdrive.model.ProfilChauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfilChauffeurRepository extends JpaRepository<ProfilChauffeur, UUID> {

    Optional<ProfilChauffeur> findByUtilisateurId(UUID utilisateurId);

    List<ProfilChauffeur> findByDisponibleTrue();

    @Query("""
        SELECT pc FROM ProfilChauffeur pc
        WHERE pc.disponible = true
          AND pc.latitude IS NOT NULL
          AND pc.longitude IS NOT NULL
          AND (6371 * acos(
                cos(radians(:lat)) * cos(radians(pc.latitude))
                * cos(radians(pc.longitude) - radians(:lng))
                + sin(radians(:lat)) * sin(radians(pc.latitude))
              )) <= :radiusKm
        ORDER BY (6371 * acos(
                cos(radians(:lat)) * cos(radians(pc.latitude))
                * cos(radians(pc.longitude) - radians(:lng))
                + sin(radians(:lat)) * sin(radians(pc.latitude))
              )) ASC
        """)
    List<ProfilChauffeur> findAvailableWithinRadius(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm
    );
}
