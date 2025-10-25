package com.vehiclerental.entity;



import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "branch")
public class Branch {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long branchId;

    @Column(nullable = false)
    private String branchName;

    private String location;
    private String contactNo;

    // Manager - optional relationship to Staff (one manager)
    @OneToOne
    @JoinColumn(name = "manager_id")
    private Staff manager;

    // Constructors, getters, setters
    public Branch() {}
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }
    public Staff getManager() { return manager; }
    public void setManager(Staff manager) { this.manager = manager; }
}
