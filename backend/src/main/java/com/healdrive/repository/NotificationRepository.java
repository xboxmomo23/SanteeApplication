package com.healdrive.repository;

import com.healdrive.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUtilisateurIdOrderByDateCreationDesc(UUID utilisateurId);
    List<Notification> findByUtilisateurIdAndLuFalseOrderByDateCreationDesc(UUID utilisateurId);
    long countByUtilisateurIdAndLuFalse(UUID utilisateurId);

    @Modifying
    @Query("UPDATE Notification n SET n.lu = true WHERE n.utilisateur.id = :userId AND n.lu = false")
    int markAllAsReadByUserId(@Param("userId") UUID userId);
}
