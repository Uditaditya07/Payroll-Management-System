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

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Authentication
                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()

                .requestMatchers(HttpMethod.GET,
                    "/api/dashboard/**",
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/payslip/**",
                    "/api/reports/**",
                    "/api/salaries/**"
                ).authenticated()

                .requestMatchers(HttpMethod.POST,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                .requestMatchers(HttpMethod.DELETE,
                    "/api/employees/**",
                    "/api/payroll/**",
                    "/api/salaries/**"
                ).hasRole("ADMIN")

                // Everything else requires authentication
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