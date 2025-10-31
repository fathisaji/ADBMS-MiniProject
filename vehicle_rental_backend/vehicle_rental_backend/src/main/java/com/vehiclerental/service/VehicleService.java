package com.vehiclerental.service;


import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class VehicleService {
    @Autowired
    private final VehicleRepository vehicleRepo;

    public VehicleService(VehicleRepository vehicleRepo) {
        this.vehicleRepo = vehicleRepo;
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepo.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepo.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        Vehicle existing = getVehicleById(id);
        existing.setBrand(updatedVehicle.getBrand());
        existing.setModel(updatedVehicle.getModel());
        existing.setDailyRate(updatedVehicle.getDailyRate());
        existing.setAvailabilityStatus(updatedVehicle.getAvailabilityStatus());
        existing.setBranch(updatedVehicle.getBranch());
        existing.setVehicleType(updatedVehicle.getVehicleType());
        existing.setRegistrationNo(updatedVehicle.getRegistrationNo());
        return vehicleRepo.save(existing);
    }

    public void deleteVehicle(Long id) {
        vehicleRepo.deleteById(id);
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepo.findByAvailabilityStatus("Available");
    }

    // ✅ Add this to fix the MaintenanceController error
    public Vehicle save(Vehicle vehicle) {
        return vehicleRepo.save(vehicle);
    }



    public List<Map<String, Object>> getVehicleView() {
        return vehicleRepo.getVehicleViewData();
    }

    public List<Map<String, Object>> getAvailableVehiclesView() {
    return vehicleRepo.getAvailableVehiclesFromView();
}

}
