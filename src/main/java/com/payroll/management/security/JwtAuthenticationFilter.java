package com.payroll.management.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        /*
         * No Authorization header.
         *
         * Let Spring Security decide whether
         * the requested endpoint is public
         * or protected.
         */

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authHeader.substring(7);

        try {

            /*
             * Extract information from ACCESS TOKEN.
             */

            String email =
                    jwtService.extractEmail(token);

            String role =
                    jwtService.extractRole(token);

            Long userId =
                    jwtService.extractUserId(token);

            /*
             * Only authenticate if there isn't
             * already an authentication object.
             */

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken
                        authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                        );

                /*
                 * Store user ID as request attribute.
                 *
                 * Controllers/services can retrieve it
                 * if needed.
                 */

                request.setAttribute(
                        "userId",
                        userId
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }

        } catch (Exception e) {

            /*
             * Invalid or expired access token.
             *
             * Do not crash the application.
             * Spring Security will return 401/403
             * for protected endpoints.
             */

            SecurityContextHolder
                    .clearContext();

            request.setAttribute(
                    "jwtError",
                    "Invalid or expired token"
            );
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}