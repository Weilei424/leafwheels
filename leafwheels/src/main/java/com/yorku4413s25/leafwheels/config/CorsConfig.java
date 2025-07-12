package com.yorku4413s25.leafwheels.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all paths
                .allowedOrigins("http://localhost:5173") // Specify allowed origins
                .allowedMethods("*") //
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow sending of cookies and authentication headers
    }
}

