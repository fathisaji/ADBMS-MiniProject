package com.vehiclerental.service;


import com.vehiclerental.entity.Branch;
import com.vehiclerental.repository.BranchRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BranchService {
    private final BranchRepository branchRepo;

    public BranchService(BranchRepository branchRepo) {
        this.branchRepo = branchRepo;
    }

    public Branch createBranch(Branch branch) {
        return branchRepo.save(branch);
    }

    public List<Branch> getAllBranches() {
        return branchRepo.findAll();
    }

    public Branch getBranchById(Long id) {
        return branchRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found"));
    }

    public Branch updateBranch(Long id, Branch updatedBranch) {
        Branch existing = getBranchById(id);
        existing.setBranchName(updatedBranch.getBranchName());
        existing.setLocation(updatedBranch.getLocation());
        existing.setContactNo(updatedBranch.getContactNo());
        return branchRepo.save(existing);
    }

    public void deleteBranch(Long id) {
        branchRepo.deleteById(id);
    }
}
