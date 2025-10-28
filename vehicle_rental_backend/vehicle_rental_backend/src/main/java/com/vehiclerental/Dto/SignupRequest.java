    package com.vehiclerental.Dto;

    public class SignupRequest {
        // User fields
        private String username;
        private String password;
        private String role; // "USER" or "CUSTOMER"

        // Customer fields
        private String fullName;
        private String nicPassportNo;
        private String phoneNo;
        private String email;
        private String address;
        private String licenseNo;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getNicPassportNo() {
            return nicPassportNo;
        }

        public void setNicPassportNo(String nicPassportNo) {
            this.nicPassportNo = nicPassportNo;
        }

        public String getPhoneNo() {
            return phoneNo;
        }

        public void setPhoneNo(String phoneNo) {
            this.phoneNo = phoneNo;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getLicenseNo() {
            return licenseNo;
        }

        public void setLicenseNo(String licenseNo) {
            this.licenseNo = licenseNo;
        }
    // Getters & setters
        // ... generate them
    }
