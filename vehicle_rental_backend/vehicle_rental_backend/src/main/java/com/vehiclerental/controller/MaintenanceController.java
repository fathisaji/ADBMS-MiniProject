package com.vehiclerental.controller;


import com.vehiclerental.entity.Maintenance;
import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.service.MaintenanceService;
import com.vehiclerental.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenances")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;
    private final VehicleService vehicleService;

    public MaintenanceController(MaintenanceService maintenanceService, VehicleService vehicleService) {
        this.maintenanceService = maintenanceService;
        this.vehicleService = vehicleService;
    }

    // Get all maintenance records
    @GetMapping
    public List<Maintenance> getAll() {
        return maintenanceService.getAllMaintenanceRecords();
    }

    // Get maintenance by ID
    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getById(@PathVariable Long id) {
        try {
            Maintenance maintenance = maintenanceService.getMaintenanceById(id);
            return ResponseEntity.ok(maintenance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new maintenance record
    @PostMapping
    public ResponseEntity<Maintenance> create(@RequestBody Maintenance maintenance) {
        // Update vehicle availability if needed
        if (maintenance.getVehicle() != null) {
            Vehicle v = maintenance.getVehicle();
            v.setAvailabilityStatus(Vehicle.AvailabilityStatus.Maintenance);
            vehicleService.save(v);
        }
        Maintenance created = maintenanceService.createMaintenance(maintenance);
        return ResponseEntity.ok(created);
    }

    // Update maintenance record
    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> update(@PathVariable Long id, @RequestBody Maintenance updated) {
        try {
            Maintenance maintenance = maintenanceService.updateMaintenance(id, updated);
            return ResponseEntity.ok(maintenance);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete maintenance record
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }
}
