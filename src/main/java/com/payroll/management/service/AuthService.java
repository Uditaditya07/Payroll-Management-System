package com.payroll.management.service;

import com.payroll.management.dto.AuthResponse;
import com.payroll.management.dto.LoginRequest;
import com.payroll.management.dto.RegisterRequest;
import com.payroll.management.entity.User;
import com.payroll.management.repository.UserRepository;
import com.payroll.management.security.JwtService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    private static final String ADMIN_EMAIL =
            "uditadityayadav07@gmail.com";

    private static final String ADMIN_PASSWORD =
            "Admin@123";

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    /*
     * =========================
     * CREATE / VERIFY ADMIN
     * =========================
     */

    @Override
    public void run(String... args) {

        User existingUser =
                userRepository
                        .findByEmail(ADMIN_EMAIL)
                        .orElse(null);

        if (existingUser == null) {

            String hashedPassword =
                    passwordEncoder.encode(
                            ADMIN_PASSWORD
                    );

            User admin = new User(
                    "Uditaditya Yadav",
                    ADMIN_EMAIL,
                    hashedPassword,
                    "ADMIN"
            );

            userRepository.save(admin);

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "ADMIN ACCOUNT CREATED"
            );

            System.out.println(
                    "Email: " + ADMIN_EMAIL
            );

            System.out.println(
                    "Role: ADMIN"
            );

            System.out.println(
                    "========================================"
            );

        } else {

            existingUser.setRole("ADMIN");

            existingUser.setPassword(
                    passwordEncoder.encode(
                            ADMIN_PASSWORD
                    )
            );

            userRepository.save(existingUser);

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "ADMIN ACCOUNT VERIFIED"
            );

            System.out.println(
                    "Email: " + ADMIN_EMAIL
            );

            System.out.println(
                    "Role: ADMIN"
            );

            System.out.println(
                    "========================================"
            );
        }
    }

    /*
     * =========================
     * REGISTER
     * =========================
     */

    public AuthResponse register(
            RegisterRequest request) {

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        String role = "EMPLOYEE";

        String hashedPassword =
                passwordEncoder.encode(
                        request.getPassword()
                );

        User user = new User(
                request.getName(),
                request.getEmail(),
                hashedPassword,
                role
        );

        User savedUser =
                userRepository.save(user);

        String accessToken =
                jwtService.generateAccessToken(
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getRole()
                );

        String refreshToken =
                jwtService.generateRefreshToken(
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getRole()
                );

        return new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                accessToken,
                refreshToken
        );
    }

    /*
     * =========================
     * LOGIN
     * =========================
     */

    public AuthResponse login(
            LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String accessToken =
                jwtService.generateAccessToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                );

        String refreshToken =
                jwtService.generateRefreshToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                );

        return new AuthResponse(
                "Login successful",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                accessToken,
                refreshToken
        );
    }

    /*
     * =========================
     * REFRESH ACCESS TOKEN
     * =========================
     */

    public AuthResponse refreshToken(
            String refreshToken) {

        if (refreshToken == null ||
                refreshToken.isBlank()) {

            throw new RuntimeException(
                    "Refresh token is required"
            );
        }

        try {

            /*
             * Verify that the refresh token is
             * valid and has not expired.
             */

            if (!jwtService.isRefreshToken(
                    refreshToken)) {

                throw new RuntimeException(
                        "Invalid refresh token"
                );
            }

            /*
             * Extract user information from
             * the refresh token.
             */

            Long userId =
                    jwtService.extractUserId(
                            refreshToken
                    );

            String email =
                    jwtService.extractEmail(
                            refreshToken
                    );

            /*
             * Find the current user.
             *
             * This also ensures that a deleted
             * user cannot continue refreshing tokens.
             */

            User user =
                    userRepository
                            .findById(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            /*
             * Make sure the email in the token
             * still matches the database user.
             */

            if (!user.getEmail()
                    .equalsIgnoreCase(email)) {

                throw new RuntimeException(
                        "Invalid refresh token"
                );
            }

            /*
             * Generate a NEW access token.
             *
             * The refresh token itself remains
             * valid for its 30-day lifetime.
             */

            String newAccessToken =
                    jwtService.generateAccessToken(
                            user.getId(),
                            user.getEmail(),
                            user.getRole()
                    );

            /*
             * Return the new access token.
             *
             * We also return the existing refresh
             * token so the frontend can continue
             * storing it.
             */

            return new AuthResponse(
                    "Access token refreshed",
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    newAccessToken,
                    refreshToken
            );

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid or expired refresh token"
            );
        }
    }
}