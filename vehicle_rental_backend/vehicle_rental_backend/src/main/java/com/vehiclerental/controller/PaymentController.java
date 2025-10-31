package com.vehiclerental.controller;

import com.vehiclerental.entity.Payment;
import com.vehiclerental.service.PaymentService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    private final PaymentService service;
    private final Path slipStorage = Paths.get("uploads/slips").toAbsolutePath().normalize();

    public PaymentController(PaymentService service) throws IOException {
        this.service = service;
        Files.createDirectories(slipStorage);
    }

    @GetMapping
    public List<Payment> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Payment getById(@PathVariable Long id) { return service.getById(id); }

    /* Customer submits online payment with slip */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Payment create(
            @RequestPart("payment") Payment payment,
            @RequestPart(value = "slip", required = false) MultipartFile slip) throws IOException {

        if (slip != null && !slip.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + slip.getOriginalFilename();
            Path target = slipStorage.resolve(fileName);
            Files.copy(slip.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            payment.setSlipFileName(fileName);
        }
        return service.create(payment);
    }

    /* Admin updates status / notes */
    @PutMapping("/{id}")
    public Payment update(@PathVariable Long id, @RequestBody Payment dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }

    /* Download slip */
    @GetMapping("/{id}/slip")
    public ResponseEntity<byte[]> downloadSlip(@PathVariable Long id) throws IOException {
        Payment p = service.getById(id);
        if (p.getSlipFileName() == null) return ResponseEntity.notFound().build();

        Path file = slipStorage.resolve(p.getSlipFileName());
        byte[] bytes = Files.readAllBytes(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + p.getSlipFileName() + "\"")
                .body(bytes);
    }
}