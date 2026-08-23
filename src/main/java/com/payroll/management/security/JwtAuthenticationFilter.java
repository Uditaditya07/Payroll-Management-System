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
         * =========================
         * NO TOKEN
         * =========================
         */

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        /*
         * =========================
         * EXTRACT TOKEN
         * =========================
         */

        String token =
                authHeader.substring(7).trim();


        try {

            /*
             * =========================
             * ONLY ACCESS TOKEN
             * =========================
             *
             * Refresh tokens must NEVER
             * authenticate normal API
             * requests.
             */

            if (!jwtService.isAccessToken(token)) {

                SecurityContextHolder
                        .clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            /*
             * =========================
             * EXTRACT USER DETAILS
             * =========================
             */

            String email =
                    jwtService.extractEmail(token);

            String role =
                    jwtService.extractRole(token);

            Long userId =
                    jwtService.extractUserId(token);


            /*
             * =========================
             * VALIDATE DETAILS
             * =========================
             */

            if (email == null ||
                    role == null ||
                    userId == null) {

                SecurityContextHolder
                        .clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }


            /*
             * =========================
             * CREATE AUTHENTICATION
             * =========================
             */

            if (SecurityContextHolder
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
                 * Store user ID.
                 */

                request.setAttribute(
                        "userId",
                        userId
                );


                /*
                 * Store authentication
                 * in Spring Security context.
                 */

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }

        } catch (Exception e) {

            /*
             * Invalid / expired JWT.
             */

            SecurityContextHolder
                    .clearContext();

            System.out.println(
                    "JWT authentication failed: "
                            + e.getMessage()
            );
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}