package com.payroll.management.controller;

import com.payroll.management.dto.AuthResponse;
import com.payroll.management.dto.LoginRequest;
import com.payroll.management.dto.RegisterRequest;
import com.payroll.management.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService =
                authService;
    }


    /*
     * =========================
     * REGISTER
     * =========================
     */

    @PostMapping("/register")
    public AuthResponse register(
            @RequestBody RegisterRequest request) {

        return authService.register(
                request
        );
    }


    /*
     * =========================
     * LOGIN
     * =========================
     */

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(
                request
        );
    }


    /*
     * =========================
     * REFRESH ACCESS TOKEN
     * =========================
     *
     * The frontend sends the
     * 30-day refresh token here.
     *
     * A new 15-minute access token
     * is returned.
     */

    @PostMapping("/refresh")
    public AuthResponse refreshToken(
            @RequestBody RefreshTokenRequest request) {

        return authService.refreshToken(
                request.getRefreshToken()
        );
    }


    /*
     * =========================
     * REFRESH TOKEN REQUEST DTO
     * =========================
     */

    public static class RefreshTokenRequest {

        private String refreshToken;


        public RefreshTokenRequest() {
        }


        public String getRefreshToken() {

            return refreshToken;
        }


        public void setRefreshToken(
                String refreshToken) {

            this.refreshToken =
                    refreshToken;
        }
    }
}