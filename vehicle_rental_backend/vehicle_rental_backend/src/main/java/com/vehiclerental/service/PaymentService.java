package com.vehiclerental.service;

import com.vehiclerental.entity.Payment;
import com.vehiclerental.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository repo;

    public PaymentService(PaymentRepository repo) {
        this.repo = repo;
    }

    public List<Payment> getAll() { return repo.findAll(); }

    public Payment getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
    }

    @Transactional
    public Payment create(Payment p) {
        return repo.save(p);
    }

    @Transactional
    public Payment update(Long id, Payment dto) {
        Payment p = getById(id);
        p.setAmount(dto.getAmount());
        p.setPaymentMethod(dto.getPaymentMethod());
        p.setPaymentDate(dto.getPaymentDate());
        p.setPaymentStatus(dto.getPaymentStatus());
        p.setTransactionId(dto.getTransactionId());
        p.setSlipFileName(dto.getSlipFileName());
        p.setPaymentDetails(dto.getPaymentDetails());
        p.setAdminNotes(dto.getAdminNotes());
        return repo.save(p);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    /* Called by MySQL event through procedure */
    public List<Payment> getPendingOnlinePayments() {
        return repo.findPendingOnlinePayments();
    }
}