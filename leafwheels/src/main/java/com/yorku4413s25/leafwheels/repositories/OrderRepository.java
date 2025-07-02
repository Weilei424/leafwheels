package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findAllByUserId(UUID userId);
}
