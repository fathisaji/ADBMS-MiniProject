package com.vehiclerental.controller;

import com.vehiclerental.entity.BankAccount;
import com.vehiclerental.service.BankAccountService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bank-accounts")
@CrossOrigin
public class BankAccountController {

    private final BankAccountService service;

    public BankAccountController(BankAccountService service) {
        this.service = service;
    }

    @GetMapping
    public List<BankAccount> getAll() { return service.getAll(); }

    @GetMapping("/active")
    public List<BankAccount> getActive() { return service.getActive(); }

    @GetMapping("/{id}")
    public BankAccount getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public BankAccount create(@RequestBody BankAccount b) { return service.create(b); }

    @PutMapping("/{id}")
    public BankAccount update(@PathVariable Long id, @RequestBody BankAccount dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}