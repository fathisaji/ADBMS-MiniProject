package com.vehiclerental.service;


import com.vehiclerental.entity.Rental;
import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.RentalRepository;
import com.vehiclerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalService {
    private final RentalRepository rentalRepo;
    private final VehicleRepository vehicleRepo;

    public RentalService(RentalRepository rentalRepo, VehicleRepository vehicleRepo) {
        this.rentalRepo = rentalRepo;
        this.vehicleRepo = vehicleRepo;
    }

    public Rental createRental(Rental rental) {
        Vehicle v = rental.getVehicle();
        if (v == null || v.getVehicleId() == null) {
            throw new IllegalArgumentException("Vehicle required");
        }

        Vehicle vehicle = vehicleRepo.findById(v.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        if (vehicle.getAvailabilityStatus() != Vehicle.AvailabilityStatus.Available) {
            throw new IllegalStateException("Vehicle is not available");
        }

        vehicle.setAvailabilityStatus(Vehicle.AvailabilityStatus.Rented);
        vehicleRepo.save(vehicle);

        rental.setRentalStatus(Rental.RentalStatus.Ongoing);
        return rentalRepo.save(rental);
    }

    public Rental completeRental(Long rentalId) {
        Rental r = rentalRepo.findById(rentalId)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));
        r.setRentalStatus(Rental.RentalStatus.Completed);
        rentalRepo.save(r);

        Vehicle v = r.getVehicle();
        v.setAvailabilityStatus(Vehicle.AvailabilityStatus.Available);
        vehicleRepo.save(v);
        return r;
    }

    public void deleteRental(Long id) {
        rentalRepo.deleteById(id);
    }

    // ✅ Add these methods to match your controller
    public List<Rental> getAllRentals() {
        return rentalRepo.findAll();
    }

    public Rental getRentalById(Long id) {
        return rentalRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));
    }
}