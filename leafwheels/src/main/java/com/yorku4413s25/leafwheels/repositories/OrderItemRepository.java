package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
}
