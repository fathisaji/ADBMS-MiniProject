package com.vehiclerental.service;


import com.vehiclerental.entity.Customer;
import com.vehiclerental.entity.Rental;
import com.vehiclerental.entity.Staff;
import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.CustomerRepository;
import com.vehiclerental.repository.RentalRepository;
import com.vehiclerental.repository.StaffRepository;
import com.vehiclerental.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalService {
    private final RentalRepository rentalRepo;
    private final VehicleRepository vehicleRepo;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private StaffRepository staffRepository;

    public RentalService(RentalRepository rentalRepo, VehicleRepository vehicleRepo) {
        this.rentalRepo = rentalRepo;
        this.vehicleRepo = vehicleRepo;
    }

    public Rental createRental(Rental rental) {
        // Load existing customer and staff from DB
        Customer customer = customerRepository.findById(rental.getCustomer().getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Staff staff = staffRepository.findById(rental.getStaff().getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        rental.setCustomer(customer);
        rental.setStaff(staff);

        return rentalRepo.save(rental);
    }

    public Rental approveRental(Long rentalId) {
        Rental rental = rentalRepo.findById(rentalId)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        rental.setRentalStatus(Rental.RentalStatus.Completed);

        // Make vehicle unavailable while rented
        Vehicle v = rental.getVehicle();
        v.setAvailabilityStatus(Vehicle.AvailabilityStatus.Rented);
        vehicleRepo.save(v);

        return rentalRepo.save(rental);
    }

    public Rental rejectRental(Long rentalId) {
        Rental rental = rentalRepo.findById(rentalId)
                .orElseThrow(() -> new IllegalArgumentException("Rental not found"));

        rental.setRentalStatus(Rental.RentalStatus.Cancelled);
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

    public List<Rental> getRentalsByUser(Long userId) {
        return rentalRepo.findByCustomerCustomerId(userId);
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