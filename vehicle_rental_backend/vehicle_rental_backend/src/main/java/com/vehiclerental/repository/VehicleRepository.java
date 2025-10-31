package com.vehiclerental.repository;


import com.vehiclerental.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    // Custom query to find vehicles by availability status
    List<Vehicle> findByAvailabilityStatus(String status);

    // Custom query to find vehicles by branch
    List<Vehicle> findByBranch_BranchId(Long branchId);

    @Query(value = "SELECT * FROM vehicle_dashboard_view", nativeQuery = true)
    List<Map<String, Object>> getVehicleViewData();

    @Query(value = "SELECT * FROM vehicle_dashboard_view", nativeQuery = true)
List<Map<String, Object>> getVehicleDashboardData();

@Query(value = "SELECT * FROM View_Available_Vehicles", nativeQuery = true)
List<Map<String, Object>> getAvailableVehiclesFromView();

}

