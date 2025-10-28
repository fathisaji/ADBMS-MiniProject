package com.vehiclerental.repository;


import com.vehiclerental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

    // Find all rentals by a specific customer
    List<Rental> findByCustomer_CustomerId(Long customerId);

    // Find rentals by status (e.g. 'Ongoing', 'Completed')
    List<Rental> findByRentalStatus(String status);

    List<Rental> findByCustomerCustomerId(Long customerId);
}
