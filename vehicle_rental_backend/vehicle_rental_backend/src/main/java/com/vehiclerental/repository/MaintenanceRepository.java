package com.vehiclerental.repository;

import com.vehiclerental.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    // Find all maintenance records for a specific vehicle
    List<Maintenance> findByVehicle_VehicleId(Long vehicleId);
}

