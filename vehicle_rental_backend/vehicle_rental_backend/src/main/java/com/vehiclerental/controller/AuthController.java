package com.vehiclerental.controller;

import com.vehiclerental.Dto.SignupRequest;
import com.vehiclerental.entity.Customer;
import com.vehiclerental.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vehiclerental.entity.User;
import com.vehiclerental.repository.UserRepository;
import com.vehiclerental.util.JwtUtil;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        if (userRepository.findByUsername(signupRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        // Save user
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setRole(signupRequest.getRole() != null ? signupRequest.getRole() : "USER");
        userRepository.save(user);

        // If role is CUSTOMER, save customer details
        if ("CUSTOMER".equalsIgnoreCase(signupRequest.getRole())) {
            Customer customer = new Customer();
            customer.setFullName(signupRequest.getFullName());
            customer.setNicPassportNo(signupRequest.getNicPassportNo());
            customer.setPhoneNo(signupRequest.getPhoneNo());
            customer.setEmail(signupRequest.getEmail());
            customer.setAddress(signupRequest.getAddress());
            customer.setLicenseNo(signupRequest.getLicenseNo());
            customer.setUsername(signupRequest.getUsername()); // link to User table
            // Save to customer table
            customerRepository.save(customer);
        }

        return ResponseEntity.ok("User registered successfully!");
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(loginRequest.getUsername());
            String role = userOpt.get().getRole();
            return ResponseEntity.ok(Map.of("token", token, "role", role));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

}
