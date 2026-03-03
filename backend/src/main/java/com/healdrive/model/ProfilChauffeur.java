package com.healdrive.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profil_chauffeurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfilChauffeur {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false, unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Utilisateur utilisateur;

    @Column(name = "numero_agrement_cpam", nullable = false, length = 50)
    private String numeroAgrementCpam;

    @Column(name = "zone_geo", nullable = false, length = 200)
    @Builder.Default
    private String zoneGeo = "Paris et Ile-de-France";

    @Column(nullable = false)
    @Builder.Default
    private Boolean disponible = true;

    @Column(columnDefinition = "DOUBLE PRECISION")
    private Double latitude;

    @Column(columnDefinition = "DOUBLE PRECISION")
    private Double longitude;

    @Column(name = "position_maj")
    private OffsetDateTime positionMaj;

    @Column(name = "note_moyenne", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal noteMoyenne = BigDecimal.ZERO;

    @Column(name = "nombre_courses", nullable = false)
    @Builder.Default
    private Integer nombreCourses = 0;

    @CreationTimestamp
    @Column(name = "date_creation", nullable = false, updatable = false)
    private OffsetDateTime dateCreation;

    @OneToMany(mappedBy = "chauffeur", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<Vehicule> vehicules = new ArrayList<>();

    @OneToMany(mappedBy = "chauffeur", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<Trajet> trajets = new ArrayList<>();
}
