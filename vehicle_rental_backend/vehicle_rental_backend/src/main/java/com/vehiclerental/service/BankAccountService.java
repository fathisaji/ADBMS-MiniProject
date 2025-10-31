package com.vehiclerental.service;

import com.vehiclerental.entity.BankAccount;
import com.vehiclerental.repository.BankAccountRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BankAccountService {

    private final BankAccountRepository repo;

    public BankAccountService(BankAccountRepository repo) {
        this.repo = repo;
    }

    public List<BankAccount> getAll() { return repo.findAll(); }
    public List<BankAccount> getActive() { return repo.findByIsActiveTrue(); }

    public BankAccount getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bank account not found"));
    }

    public BankAccount create(BankAccount b) { return repo.save(b); }

    public BankAccount update(Long id, BankAccount dto) {
        BankAccount b = getById(id);
        b.setBankName(dto.getBankName());
        b.setBranch(dto.getBranch());
        b.setAccountNumber(dto.getAccountNumber());
        b.setAccountHolderName(dto.getAccountHolderName());
        b.setAccountType(dto.getAccountType());
        b.setIsActive(dto.getIsActive());
        return repo.save(b);
    }

    public void delete(Long id) { repo.deleteById(id); }
}