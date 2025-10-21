package com.vehiclerental.service;


import com.vehiclerental.entity.Maintenance;
import com.vehiclerental.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepo;

    public MaintenanceService(MaintenanceRepository maintenanceRepo) {
        this.maintenanceRepo = maintenanceRepo;
    }

    public Maintenance createMaintenance(Maintenance maintenance) {
        return maintenanceRepo.save(maintenance);
    }

    public List<Maintenance> getAllMaintenanceRecords() {
        return maintenanceRepo.findAll();
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance record not found"));
    }

    public Maintenance updateMaintenance(Long id, Maintenance updated) {
        Maintenance existing = getMaintenanceById(id);
        existing.setMaintenanceDate(updated.getMaintenanceDate());
        existing.setDescription(updated.getDescription());
        existing.setCost(updated.getCost());
        existing.setNextServiceDate(updated.getNextServiceDate());
        return maintenanceRepo.save(existing);
    }

    public void deleteMaintenance(Long id) {
        maintenanceRepo.deleteById(id);
    }
}

