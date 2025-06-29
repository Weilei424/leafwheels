package com.yorku4413s25.leafwheels.repositories;

import com.yorku4413s25.leafwheels.domain.Accessory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AccessoryRepository extends JpaRepository<Accessory, UUID> {
}
