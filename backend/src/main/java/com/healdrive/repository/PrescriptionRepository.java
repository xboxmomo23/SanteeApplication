package com.healdrive.repository;

import com.healdrive.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {

    List<Prescription> findByPatientId(UUID patientId);

    List<Prescription> findByPatientIdAndValideeTrue(UUID patientId);

    @Query("""
        SELECT p FROM Prescription p
        WHERE p.patient.id = :patientId
          AND p.validee = true
          AND p.dateValidite >= :date
        ORDER BY p.dateValidite ASC
        """)
    List<Prescription> findValidPrescriptions(
            @Param("patientId") UUID patientId,
            @Param("date") LocalDate date
    );
}
