package com.healdrive.model;

import com.healdrive.model.enums.TypeVehicule;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "vehicules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chauffeur_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ProfilChauffeur chauffeur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TypeVehicule type;

    @Column(nullable = false, unique = true, length = 20)
    private String immatriculation;

    @Column(length = 50)
    private String marque;

    @Column(length = 50)
    private String modele;

    private Integer annee;

    @Column(name = "agrement_cpam", length = 50)
    private String agrementCpam;

    @Column(columnDefinition = "TEXT")
    private String equipements;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;

    @CreationTimestamp
    @Column(name = "date_creation", nullable = false, updatable = false)
    private OffsetDateTime dateCreation;
}
