package com.vehiclerental.repository;


import com.vehiclerental.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // Custom query to find vehicles by availability status
    List<Vehicle> findByAvailabilityStatus(String status);

    // Custom query to find vehicles by branch
    List<Vehicle> findByBranch_BranchId(Long branchId);
}

