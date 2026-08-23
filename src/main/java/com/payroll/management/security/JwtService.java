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
     */

    private static final String SECRET =
            "PayrollManagementSystemSecretKey2026Production123456789";


    /*
     * =========================
     * ACCESS TOKEN
     * =========================
     *
     * Valid for 15 minutes.
     */

    private static final long ACCESS_TOKEN_EXPIRATION =
            1000L * 60 * 15;


    /*
     * =========================
     * REFRESH TOKEN
     * =========================
     *
     * Valid for 30 days.
     */

    private static final long REFRESH_TOKEN_EXPIRATION =
            1000L * 60 * 60 * 24 * 30;


    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );


    /*
     * =========================
     * ACCESS TOKEN
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
                .claim("userId", userId)
                .claim("role", role)
                .claim("type", "ACCESS")
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }


    /*
     * =========================
     * REFRESH TOKEN
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
                .claim("userId", userId)
                .claim("role", role)
                .claim("type", "REFRESH")
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

    public String extractEmail(String token) {

        return getClaims(token)
                .getSubject();
    }


    /*
     * =========================
     * EXTRACT ROLE
     * =========================
     */

    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }


    /*
     * =========================
     * EXTRACT USER ID
     * =========================
     *
     * Use Number instead of directly
     * expecting Long.
     *
     * This avoids JWT numeric claim
     * conversion problems.
     */

    public Long extractUserId(String token) {

        Number userId =
                getClaims(token)
                        .get("userId", Number.class);

        return userId != null
                ? userId.longValue()
                : null;
    }


    /*
     * =========================
     * EXTRACT TOKEN TYPE
     * =========================
     */

    public String extractTokenType(String token) {

        return getClaims(token)
                .get("type", String.class);
    }


    /*
     * =========================
     * ACCESS TOKEN CHECK
     * =========================
     */

    public boolean isAccessToken(String token) {

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
     * REFRESH TOKEN CHECK
     * =========================
     */

    public boolean isRefreshToken(String token) {

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

    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}