package com.vehiclerental.service;

import com.vehiclerental.entity.RentalAuditView;
import com.vehiclerental.repository.RentalAuditViewRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RentalAuditViewService {

    private final RentalAuditViewRepository viewRepo;

    public RentalAuditViewService(RentalAuditViewRepository viewRepo) {
        this.viewRepo = viewRepo;
    }

    public List<RentalAuditView> getAllAuditViews() {
        return viewRepo.findAll(); // fetches data from the view
    }
}
