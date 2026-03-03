package com.healdrive.repository;

import com.healdrive.model.Vehicule;
import com.healdrive.model.enums.TypeVehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, UUID> {
    List<Vehicule> findByChauffeurId(UUID chauffeurId);
    Optional<Vehicule> findByChauffeurIdAndActifTrue(UUID chauffeurId);
    List<Vehicule> findByType(TypeVehicule type);
    Optional<Vehicule> findByImmatriculation(String immatriculation);
    boolean existsByImmatriculation(String immatriculation);
}
