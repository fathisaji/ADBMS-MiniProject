package com.vehiclerental.service;



import com.vehiclerental.entity.Staff;
import com.vehiclerental.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {
    private final StaffRepository staffRepo;

    public StaffService(StaffRepository staffRepo) {
        this.staffRepo = staffRepo;
    }

    public Staff createStaff(Staff staff) {
        return staffRepo.save(staff);
    }

    public List<Staff> getAllStaff() {
        return staffRepo.findAll();
    }

    public Staff getStaffById(Long id) {
        return staffRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));
    }

    public Staff updateStaff(Long id, Staff updatedStaff) {
        Staff existing = getStaffById(id);
        existing.setFullName(updatedStaff.getFullName());
        existing.setRole(updatedStaff.getRole());
        existing.setEmail(updatedStaff.getEmail());
        existing.setPhoneNo(updatedStaff.getPhoneNo());
        return staffRepo.save(existing);
    }

    public void deleteStaff(Long id) {
        staffRepo.deleteById(id);
    }
}
