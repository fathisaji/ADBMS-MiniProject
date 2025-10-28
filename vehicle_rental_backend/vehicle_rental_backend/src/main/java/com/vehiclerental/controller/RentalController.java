package com.vehiclerental.controller;


import com.vehiclerental.entity.Rental;
import com.vehiclerental.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    // Get all rentals
    @GetMapping
    public List<Rental> getAll() {
        return rentalService.getAllRentals();
    }




    // Get rental by ID
    @GetMapping("/{id}")
    public ResponseEntity<Rental> getById(@PathVariable Long id) {
        try {
            Rental rental = rentalService.getRentalById(id);
            return ResponseEntity.ok(rental);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rental>> getByUser(@PathVariable Long userId) {
        List<Rental> rentals = rentalService.getRentalsByUser(userId);
        return ResponseEntity.ok(rentals);
    }

    // Create new rental
    @PostMapping
    public ResponseEntity<Rental> createRental(@RequestBody Rental rental) {
        return ResponseEntity.ok(rentalService.createRental(rental));
    }

    // Complete a rental
    @PostMapping("/{id}/complete")
    public ResponseEntity<Rental> completeRental(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(rentalService.completeRental(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a rental
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rentalService.deleteRental(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Rental> approveRental(@PathVariable Long id) {
        Rental updated = rentalService.updateRentalStatus(id, "Completed");
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Rental> rejectRental(@PathVariable Long id) {
        Rental updated = rentalService.updateRentalStatus(id, "Cancelled");
        return ResponseEntity.ok(updated);
    }
}
