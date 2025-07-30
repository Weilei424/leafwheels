package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.ChatSession;
import com.yorku4413s25.leafwheels.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    
    Optional<ChatSession> findBySessionId(String sessionId);
    
    List<ChatSession> findByUserAndIsActiveTrue(User user);
    
    Page<ChatSession> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.updatedAt < :cutoffTime AND cs.isActive = true")
    List<ChatSession> findInactiveSessions(@Param("cutoffTime") Instant cutoffTime);
    
    @Modifying
    @Query("UPDATE ChatSession cs SET cs.isActive = false WHERE cs.updatedAt < :cutoffTime")
    int deactivateInactiveSessions(@Param("cutoffTime") Instant cutoffTime);
    
}