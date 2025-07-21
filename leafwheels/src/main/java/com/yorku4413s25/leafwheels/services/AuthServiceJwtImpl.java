package com.yorku4413s25.leafwheels.services;

import com.yorku4413s25.leafwheels.constants.Role;
import com.yorku4413s25.leafwheels.domain.User;
import com.yorku4413s25.leafwheels.exception.EmailNotFoundException;
import com.yorku4413s25.leafwheels.repositories.UserRepository;
import com.yorku4413s25.leafwheels.security.CustomUserDetailsService;
import com.yorku4413s25.leafwheels.web.mappers.UserMapper;
import com.yorku4413s25.leafwheels.web.models.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceJwtImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${security.max-login-attempts:5}")
    private int maxLoginAttempts;

    @Value("${security.account-lockout-duration:300000}")
    private long accountLockoutDuration;

    @Override
    @Transactional
    public AuthResponseDto signup(SignupRequestDto request) {
        return signupWithRole(request, Role.USER);
    }

    @Override
    @Transactional
    public AuthResponseDto signupWithRole(SignupRequestDto request, Role role) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .accountEnabled(true)
                .accountLocked(false)
                .accountExpired(false)
                .emailVerified(false)
                .failedLoginAttempts(0)
                .build();

        user = userRepository.save(user);

        CustomUserDetailsService.UserPrincipal userPrincipal = 
                CustomUserDetailsService.UserPrincipal.create(user);

        String accessToken = jwtService.generateAccessToken(userPrincipal);
        String refreshToken = jwtService.generateRefreshToken(userPrincipal);

        storeRefreshToken(user.getId(), refreshToken);

        return AuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpiration())
                .user(userMapper.userToUserDto(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponseDto signin(SigninRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getAccountLocked()) {
            throw new BadCredentialsException("Account is locked due to too many failed login attempts");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            user.setFailedLoginAttempts(0);
            user.setLastLoginAt(Instant.now());
            userRepository.save(user);

            CustomUserDetailsService.UserPrincipal userPrincipal = 
                    (CustomUserDetailsService.UserPrincipal) authentication.getPrincipal();

            String accessToken = jwtService.generateAccessToken(userPrincipal);
            String refreshToken = jwtService.generateRefreshToken(userPrincipal);

            storeRefreshToken(user.getId(), refreshToken);

            return AuthResponseDto.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtService.getAccessTokenExpiration())
                    .user(userMapper.userToUserDto(user))
                    .build();

        } catch (BadCredentialsException e) {
            handleFailedLogin(user);
            throw e;
        }
    }

    @Override
    @Transactional
    public AuthResponseDto refreshToken(RefreshTokenRequestDto request) {
        String refreshToken = request.getRefreshToken();
        String userEmail = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EmailNotFoundException(userEmail, User.class));

        String storedTokenKey = "refresh_token:" + user.getId();
        String storedToken = (String) redisTemplate.opsForValue().get(storedTokenKey);

        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        CustomUserDetailsService.UserPrincipal userPrincipal = 
                CustomUserDetailsService.UserPrincipal.create(user);

        if (!jwtService.isTokenValid(refreshToken, userPrincipal)) {
            redisTemplate.delete(storedTokenKey);
            throw new BadCredentialsException("Refresh token expired");
        }

        String newAccessToken = jwtService.generateAccessToken(userPrincipal);
        String newRefreshToken = jwtService.generateRefreshToken(userPrincipal);

        redisTemplate.delete(storedTokenKey);
        storeRefreshToken(user.getId(), newRefreshToken);

        return AuthResponseDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpiration())
                .user(userMapper.userToUserDto(user))
                .build();
    }

    @Override
    public void signout(String refreshToken) {
        try {
            String userEmail = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() ->  new EmailNotFoundException(userEmail, User.class));

            String tokenKey = "refresh_token:" + user.getId();
            redisTemplate.delete(tokenKey);
        } catch (Exception e) {
            log.warn("Error during signout: {}", e.getMessage());
        }
    }

    @Override
    public void initiatePasswordReset(PasswordResetRequestDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EmailNotFoundException(request.getEmail(), User.class));

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpiresAt(Instant.now().plusSeconds(3600)); // 1 hour

        userRepository.save(user);

        log.info("Password reset token generated for user: {}", request.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(PasswordResetDto request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (user.getPasswordResetExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiresAt(null);
        user.setFailedLoginAttempts(0);
        user.setAccountLocked(false);

        userRepository.save(user);
    }

    private void storeRefreshToken(UUID userId, String refreshToken) {
        String key = "refresh_token:" + userId;
        redisTemplate.opsForValue().set(key, refreshToken, 7, TimeUnit.DAYS);
    }

    private void handleFailedLogin(User user) {
        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

        if (user.getFailedLoginAttempts() >= maxLoginAttempts) {
            user.setAccountLocked(true);
            log.warn("Account locked for user: {} due to {} failed login attempts", 
                    user.getEmail(), user.getFailedLoginAttempts());
        }

        userRepository.save(user);
    }
}
