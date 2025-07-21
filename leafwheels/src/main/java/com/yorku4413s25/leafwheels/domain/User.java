package com.yorku4413s25.leafwheels.domain;
import com.yorku4413s25.leafwheels.constants.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Table(name = "users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;


    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length =100)
    private String password;

    @Column(name = "account_enabled", nullable = false, columnDefinition = "boolean default true")
    @Builder.Default
    private Boolean accountEnabled = true;

    @Column(name = "account_locked", nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean accountLocked = false;

    @Column(name = "account_expired", nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean accountExpired = false;

    @Column(name = "email_verified", nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(name = "failed_login_attempts", nullable = false, columnDefinition = "integer default 0")
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "password_reset_token", length = 255)
    private String passwordResetToken;

    @Column(name = "password_reset_expires_at")
    private Instant passwordResetExpiresAt;

}
