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
     * CREATE PERMANENT ADMIN
     * =========================
     */
    @Override
    public void run(String... args) {

        User existingUser =
                userRepository.findByEmail(ADMIN_EMAIL)
                        .orElse(null);

        if (existingUser == null) {

            String hashedPassword =
                    passwordEncoder.encode(ADMIN_PASSWORD);

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

            /*
             * Make sure this account always
             * remains an ADMIN.
             */
            existingUser.setRole("ADMIN");

            /*
             * Reset the password to the known
             * admin password.
             */
            existingUser.setPassword(
                    passwordEncoder.encode(ADMIN_PASSWORD)
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
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        /*
         * Normal registration creates
         * an EMPLOYEE account.
         *
         * ADMIN accounts are created
         * separately above.
         */
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

        String token =
                jwtService.generateToken(
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
                token
        );
    }

    /*
     * =========================
     * LOGIN
     * =========================
     */
    public AuthResponse login(LoginRequest request) {

        User user =
                userRepository
                        .findByEmail(request.getEmail())
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

        String token =
                jwtService.generateToken(
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
                token
        );
    }
}