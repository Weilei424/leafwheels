package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(UUID orderId);

    List<Payment> findByUserId(UUID userId);

    @Query("SELECT COUNT(p) FROM Payment p")
    long countAllPayments();
}
