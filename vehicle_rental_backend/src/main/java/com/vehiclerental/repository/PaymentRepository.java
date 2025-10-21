package com.vehiclerental.repository;


import com.vehiclerental.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by related rental
    Payment findByRental_RentalId(Long rentalId);
}
