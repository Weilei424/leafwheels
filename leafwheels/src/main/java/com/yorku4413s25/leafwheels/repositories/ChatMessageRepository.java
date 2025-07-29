package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.ChatMessage;
import com.yorku4413s25.leafwheels.domain.ChatSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByChatSessionOrderByCreatedAtAsc(ChatSession chatSession);
    
    Page<ChatMessage> findByChatSessionOrderByCreatedAtDesc(ChatSession chatSession, Pageable pageable);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session AND cm.createdAt > :since ORDER BY cm.createdAt ASC")
    List<ChatMessage> findRecentMessages(@Param("session") ChatSession session, @Param("since") Instant since);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.chatSession.user.id = :userId AND cm.createdAt > :since AND cm.isFromUser = true")
    long countUserMessagesSince(@Param("userId") Long userId, @Param("since") Instant since);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession = :session AND cm.intent IS NOT NULL ORDER BY cm.createdAt DESC")
    List<ChatMessage> findIntentMessages(@Param("session") ChatSession session, Pageable pageable);
    
    void deleteByChatSession(ChatSession chatSession);
}