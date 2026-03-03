package com.healdrive.repository;

import com.healdrive.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByTrajetIdOrderByDateEnvoiAsc(UUID trajetId);

    @Query("""
        SELECT COUNT(m) FROM Message m
        WHERE m.trajet.id = :trajetId
          AND m.expediteur.id != :userId
          AND m.lu = false
        """)
    long countUnreadByTrajetAndUser(
            @Param("trajetId") UUID trajetId,
            @Param("userId") UUID userId
    );

    @Modifying
    @Query("""
        UPDATE Message m SET m.lu = true
        WHERE m.trajet.id = :trajetId
          AND m.expediteur.id != :userId
          AND m.lu = false
        """)
    int markAsReadByTrajetAndUser(
            @Param("trajetId") UUID trajetId,
            @Param("userId") UUID userId
    );
}
