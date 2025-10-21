package com.vehiclerental.controller;


import com.vehiclerental.entity.Staff;
import com.vehiclerental.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    // Get all staff
    @GetMapping
    public List<Staff> getAll() {
        return staffService.getAllStaff();
    }

    // Get a single staff by ID
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getById(@PathVariable Long id) {
        try {
            Staff staff = staffService.getStaffById(id);
            return ResponseEntity.ok(staff);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new staff
    @PostMapping
    public ResponseEntity<Staff> create(@RequestBody Staff staff) {
        Staff createdStaff = staffService.createStaff(staff);
        return ResponseEntity.ok(createdStaff);
    }

    // Update a staff member
    @PutMapping("/{id}")
    public ResponseEntity<Staff> update(@PathVariable Long id, @RequestBody Staff updated) {
        try {
            Staff updatedStaff = staffService.updateStaff(id, updated);
            return ResponseEntity.ok(updatedStaff);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a staff member
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}
