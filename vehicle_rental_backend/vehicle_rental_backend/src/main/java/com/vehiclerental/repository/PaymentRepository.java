package com.vehiclerental.repository;

import com.vehiclerental.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByRental_RentalId(Long rentalId);

    /* Used by MySQL event to auto-approve after 6 days */
    @Query("SELECT p FROM Payment p WHERE p.paymentStatus = 'Pending' AND p.paymentMethod = 'Online'")
    List<Payment> findPendingOnlinePayments();
}