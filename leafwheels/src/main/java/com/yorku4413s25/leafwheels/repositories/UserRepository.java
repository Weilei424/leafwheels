package com.yorku4413s25.leafwheels.repositories;
import com.yorku4413s25.leafwheels.domain.User;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPasswordResetToken(String token);
}

