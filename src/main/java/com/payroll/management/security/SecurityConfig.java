package com.payroll.management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    /*
     * =========================
     * SECURITY FILTER CHAIN
     * =========================
     */

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            /*
             * =========================
             * CORS
             * =========================
             */

            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )

            /*
             * =========================
             * CSRF
             * =========================
             *
             * Disabled because the frontend
             * communicates with the backend
             * using JWT authentication.
             */

            .csrf(csrf ->
                    csrf.disable()
            )

            /*
             * =========================
             * SESSION MANAGEMENT
             * =========================
             *
             * JWT authentication is stateless.
             */

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            /*
             * =========================
             * AUTHORIZATION
             * =========================
             */

            .authorizeHttpRequests(auth -> auth

                    /*
                     * Authentication endpoints
                     * do NOT require JWT.
                     */

                    .requestMatchers(
                            "/api/auth/login",
                            "/api/auth/register"
                    ).permitAll()

                    /*
                     * OPTIONS requests are required
                     * for CORS preflight.
                     */

                    .requestMatchers(
                            org.springframework.http.HttpMethod.OPTIONS,
                            "/**"
                    ).permitAll()

                    /*
                     * Everything else requires
                     * a valid JWT token.
                     */

                    .anyRequest().authenticated()
            )

            /*
             * =========================
             * JWT FILTER
             * =========================
             *
             * Run our JWT filter before
             * Spring's username/password filter.
             */

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    /*
     * =========================
     * CORS CONFIGURATION
     * =========================
     */

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        /*
         * Allow frontend origins.
         *
         * "*" is useful during development,
         * especially when using GitHub Codespaces.
         */

        configuration.setAllowedOriginPatterns(
                Arrays.asList("*")
        );

        /*
         * HTTP methods used by the application.
         */

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        /*
         * Allow required headers including
         * Authorization: Bearer <JWT>
         */

        configuration.setAllowedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin",
                        "X-Requested-With"
                )
        );

        /*
         * Allow frontend to read response headers.
         */

        configuration.setExposedHeaders(
                Arrays.asList(
                        "Authorization"
                )
        );

        /*
         * We are using JWT in the Authorization
         * header rather than cookies.
         */

        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}