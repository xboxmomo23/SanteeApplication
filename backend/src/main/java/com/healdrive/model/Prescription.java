package com.healdrive.model;

import com.healdrive.model.enums.TypeVehicule;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProfilPatient patient;

    @Column(name = "medecin_prescripteur", nullable = false, length = 200)
    private String medecinPrescripteur;

    @Column(nullable = false, length = 300)
    private String etablissement;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_transport_requis", nullable = false, length = 20)
    private TypeVehicule typeTransportRequis;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String motif;

    @Column(name = "date_emission", nullable = false)
    private LocalDate dateEmission;

    @Column(name = "date_validite", nullable = false)
    private LocalDate dateValidite;

    @Column(name = "fichier_url", length = 500)
    private String fichierUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean validee = false;

    @CreationTimestamp
    @Column(name = "date_creation", nullable = false, updatable = false)
    private OffsetDateTime dateCreation;
}
