package com.vehiclerental.repository;


import com.vehiclerental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {

    // Find all rentals by a specific customer
    List<Rental> findByCustomer_CustomerId(Long customerId);

    // Find rentals by status (e.g. 'Ongoing', 'Completed')
    List<Rental> findByRentalStatus(String status);

    List<Rental> findByCustomerCustomerId(Long customerId);

    @Query(value = "SELECT * FROM View_Active_Rentals", nativeQuery = true)
    List<Map<String, Object>> getActiveRentalsFromView();

    @Query(value = "SELECT CalcRentalAmount(:vehicleId, :rentDate, :returnDate)", nativeQuery = true)
    Double calculateRentalAmount(
        @Param("vehicleId") int vehicleId,
        @Param("rentDate") LocalDate rentDate,
        @Param("returnDate") LocalDate returnDate
    );
}
