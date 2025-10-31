package com.vehiclerental.controller;

import com.vehiclerental.entity.RentalAuditView;
import com.vehiclerental.service.RentalAuditViewService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rentals/audit/view")
public class RentalAuditViewController {

    private final RentalAuditViewService service;

    public RentalAuditViewController(RentalAuditViewService service) {
        this.service = service;
    }

    @GetMapping
    public List<RentalAuditView> getAuditView() {
        return service.getAllAuditViews();
    }
}
