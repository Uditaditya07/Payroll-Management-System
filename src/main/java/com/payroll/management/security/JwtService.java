package com.payroll.management.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.stereotype.Service;

@Service
public class JwtService {

    /*
     * =========================
     * JWT SECRET
     * =========================
     *
     * IMPORTANT:
     * Keep this secret unchanged.
     *
     * Changing it invalidates all
     * previously generated tokens.
     */

    private static final String SECRET =
            "PayrollManagementSystemSecretKey2026Production123456789";


    /*
     * =========================
     * ACCESS TOKEN
     * =========================
     *
     * Access token validity:
     *
     * 15 minutes
     */

    private static final long ACCESS_TOKEN_EXPIRATION =
            1000L
                    * 60
                    * 15;


    /*
     * =========================
     * REFRESH TOKEN
     * =========================
     *
     * Refresh token validity:
     *
     * 30 days
     */

    private static final long REFRESH_TOKEN_EXPIRATION =
            1000L
                    * 60
                    * 60
                    * 24
                    * 30;


    /*
     * =========================
     * SECRET KEY
     * =========================
     */

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(
                            StandardCharsets.UTF_8
                    )
            );


    /*
     * =========================
     * GENERATE ACCESS TOKEN
     * =========================
     */

    public String generateAccessToken(
            Long userId,
            String email,
            String role) {

        Date now = new Date();

        Date expiration =
                new Date(
                        now.getTime()
                                + ACCESS_TOKEN_EXPIRATION
                );

        return Jwts.builder()

                .subject(email)

                .claim(
                        "userId",
                        userId
                )

                .claim(
                        "role",
                        role
                )

                .claim(
                        "type",
                        "ACCESS"
                )

                .issuedAt(now)

                .expiration(expiration)

                .signWith(key)

                .compact();
    }


    /*
     * =========================
     * GENERATE REFRESH TOKEN
     * =========================
     */

    public String generateRefreshToken(
            Long userId,
            String email,
            String role) {

        Date now = new Date();

        Date expiration =
                new Date(
                        now.getTime()
                                + REFRESH_TOKEN_EXPIRATION
                );

        return Jwts.builder()

                .subject(email)

                .claim(
                        "userId",
                        userId
                )

                .claim(
                        "role",
                        role
                )

                .claim(
                        "type",
                        "REFRESH"
                )

                .issuedAt(now)

                .expiration(expiration)

                .signWith(key)

                .compact();
    }


    /*
     * =========================
     * EXTRACT EMAIL
     * =========================
     */

    public String extractEmail(
            String token) {

        return getClaims(token)
                .getSubject();
    }


    /*
     * =========================
     * EXTRACT ROLE
     * =========================
     */

    public String extractRole(
            String token) {

        return getClaims(token)
                .get(
                        "role",
                        String.class
                );
    }


    /*
     * =========================
     * EXTRACT USER ID
     * =========================
     */

    public Long extractUserId(
            String token) {

        return getClaims(token)
                .get(
                        "userId",
                        Long.class
                );
    }


    /*
     * =========================
     * EXTRACT TOKEN TYPE
     * =========================
     */

    public String extractTokenType(
            String token) {

        return getClaims(token)
                .get(
                        "type",
                        String.class
                );
    }


    /*
     * =========================
     * CHECK ACCESS TOKEN
     * =========================
     */

    public boolean isAccessToken(
            String token) {

        try {

            return "ACCESS".equals(
                    extractTokenType(token)
            );

        } catch (Exception e) {

            return false;
        }
    }


    /*
     * =========================
     * CHECK REFRESH TOKEN
     * =========================
     */

    public boolean isRefreshToken(
            String token) {

        try {

            return "REFRESH".equals(
                    extractTokenType(token)
            );

        } catch (Exception e) {

            return false;
        }
    }


    /*
     * =========================
     * GET CLAIMS
     * =========================
     */

    private Claims getClaims(
            String token) {

        return Jwts.parser()

                .verifyWith(key)

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}