package com.yorku4413s25.leafwheels.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Enables Spring Security for the application.
public class SecurityConfig {


//    Authentication info is not stored in memory or session — it’s stateless, ideal for REST APIs.
//    Users are loaded using your custom UserDetailsService, likely backed by a database.

    @Autowired
    private UserDetailsService userDetailsService; // Service to load user data from DB or other source

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                // Disable CSRF since we're building a stateless REST API
                .csrf(csrf -> csrf.disable())

                // Require authentication for all requests
                .authorizeHttpRequests(request -> request.anyRequest().authenticated())

                // Enable HTTP Basic authentication (username/password in request headers)
                .httpBasic(Customizer.withDefaults())

                // Don't use HTTP session to store authentication info (stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .build();
    }


//    @Bean
//    public UserDetailsService userDetailsService() {
//
//        UserDetails user1 = User
//                .withDefaultPasswordEncoder()
//                .username("Tarang")
//                .password("T@123")
//                .roles("USER")
//                .build();
//
//        UserDetails user2 = User
//                .withDefaultPasswordEncoder()
//                .username("harsh")
//                .password("h@123")
//                .roles("ADMIN")
//                .build();
//        return new InMemoryUserDetailsManager(user1, user2);
//    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        // DAO-based authentication provider (connects to UserDetailsService)
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

        // Use bcrypt to hash and check passwords
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));

        // Set our user details service (from DB, custom logic, etc.)
        provider.setUserDetailsService(userDetailsService);

        return provider;
    }
}
