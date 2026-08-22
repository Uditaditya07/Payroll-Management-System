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

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173"
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
                Arrays.asList(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
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

    /*
     * =========================
     * SECURITY
     * =========================
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors -> cors.configurationSource(
                    corsConfigurationSource()
            ))

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                /*
                 * =========================
                 * AUTHENTICATION
                 * =========================
                 */

                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()

                /*
                 * =========================
                 * GET
                 * =========================
                 */

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/dashboard/**",
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/payslip/**",
                    "/api/reports/**",
                    "/api/salaries/**"
                ).authenticated()

                /*
                 * =========================
                 * POST
                 * =========================
                 */

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                /*
                 * =========================
                 * PUT
                 * =========================
                 */

                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                /*
                 * =========================
                 * DELETE
                 * =========================
                 */

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                /*
                 * =========================
                 * EVERYTHING ELSE
                 * =========================
                 */

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