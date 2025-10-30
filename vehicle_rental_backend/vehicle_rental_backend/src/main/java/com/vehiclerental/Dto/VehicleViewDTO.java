package com.vehiclerental.Dto;


public class VehicleViewDTO {
    private String vehicleType;
    private String brand;
    private String model;
    private String registrationNo;
    private Double dailyRate;
    private String branchName;
    private String availabilityStatus;

    public VehicleViewDTO(String vehicleType, String brand, String model, String registrationNo,
                          Double dailyRate, String branchName, String availabilityStatus) {
        this.vehicleType = vehicleType;
        this.brand = brand;
        this.model = model;
        this.registrationNo = registrationNo;
        this.dailyRate = dailyRate;
        this.branchName = branchName;
        this.availabilityStatus = availabilityStatus;
    }

    // getters


    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getRegistrationNo() {
        return registrationNo;
    }

    public void setRegistrationNo(String registrationNo) {
        this.registrationNo = registrationNo;
    }

    public Double getDailyRate() {
        return dailyRate;
    }

    public void setDailyRate(Double dailyRate) {
        this.dailyRate = dailyRate;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }
}
