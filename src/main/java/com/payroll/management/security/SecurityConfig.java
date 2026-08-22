package com.payroll.management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                Arrays.asList(
                        "http://localhost:*",
                        "https://*.app.github.dev"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setExposedHeaders(
                Arrays.asList("Authorization")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(
                corsConfigurationSource()
            ))

            .csrf(csrf ->
                csrf.disable()
            )

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                /* =========================
                   AUTHENTICATION
                ========================= */

                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()

                /* =========================
                   GET REQUESTS
                ========================= */

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/dashboard/**",
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/payslip/**",
                    "/api/reports/**",
                    "/api/salaries/**"
                ).authenticated()

                /* =========================
                   ADMIN POST
                ========================= */

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                /* =========================
                   ADMIN PUT
                ========================= */

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                /* =========================
                   ADMIN DELETE
                ========================= */

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                /* =========================
                   OPTIONS / CORS
                ========================= */

                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                /* =========================
                   EVERYTHING ELSE
                ========================= */

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        http.headers(headers ->
            headers.frameOptions(frame ->
                frame.sameOrigin()
            )
        );

        return http.build();
    }
}