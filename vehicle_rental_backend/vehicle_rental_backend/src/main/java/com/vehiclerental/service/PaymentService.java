package com.vehiclerental.service;


import com.vehiclerental.entity.Payment;
import com.vehiclerental.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepo;

    public PaymentService(PaymentRepository paymentRepo) {
        this.paymentRepo = paymentRepo;
    }

    public Payment createPayment(Payment payment) {
        return paymentRepo.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
    }

    public Payment updatePayment(Long id, Payment updatedPayment) {
        Payment existing = getPaymentById(id);
        existing.setAmount(updatedPayment.getAmount());
        existing.setPaymentMethod(updatedPayment.getPaymentMethod());
        existing.setPaymentDate(updatedPayment.getPaymentDate());
        existing.setPaymentStatus(updatedPayment.getPaymentStatus());
        return paymentRepo.save(existing);
    }

    public void deletePayment(Long id) {
        paymentRepo.deleteById(id);
    }
}
