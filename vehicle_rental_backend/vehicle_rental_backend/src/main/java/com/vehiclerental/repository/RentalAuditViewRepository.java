package com.vehiclerental.repository;

import com.vehiclerental.entity.RentalAuditView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalAuditViewRepository extends JpaRepository<RentalAuditView, Long> {
    // read-only, no extra methods needed
}
