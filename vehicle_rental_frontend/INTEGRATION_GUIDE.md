# Frontend-Backend Integration Guide

This guide walks you through connecting the React frontend with your Spring Boot backend.

## 🔄 How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│  (http://localhost:5173 or deployed URL)                    │
│  - User Interface                                            │
│  - Form Validation                                           │
│  - Data Display                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/JSON Requests
                     │ (via fetch API)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                 Spring Boot Backend                          │
│  (http://localhost:8080)                                    │
│  - REST API Endpoints                                       │
│  - Business Logic                                           │
│  - Database Operations                                      │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Pre-Integration Checklist

- [ ] Spring Boot backend is compiled and ready to run
- [ ] Database is set up and accessible
- [ ] Backend runs on `http://localhost:8080` (or you know the correct port)
- [ ] Node.js 18+ is installed
- [ ] React frontend dependencies are installed (`pnpm install`)

## 🚀 Step-by-Step Integration

### Step 1: Configure the Backend API URL

The frontend needs to know where your backend is running.

**Default Configuration:**
- Frontend expects backend at: `http://localhost:8080/api`
- If your backend runs on a different URL, update the environment variable

**To change the API URL:**

Create a `.env.local` file in the `vehicle_rental_frontend` directory:

```bash
# .env.local
VITE_API_URL=http://localhost:8080/api
```

Or if using a different port:
```bash
VITE_API_URL=http://localhost:9090/api
```

### Step 2: Enable CORS on Backend

Your Spring Boot backend must allow requests from the frontend. Add this configuration class:

**File: `src/main/java/com/vehiclerental/config/CorsConfig.java`**

```java
package com.vehiclerental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",   // Vite dev server
                    "http://localhost:3000",   // Alternative port
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:3000"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**For production**, add your actual domain:
```java
.allowedOrigins("https://yourdomain.com", "https://www.yourdomain.com")
```

### Step 3: Start the Backend

```bash
# Navigate to your Spring Boot project directory
cd rental

# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using the compiled JAR
java -jar target/vehicle-rental-0.0.1-SNAPSHOT.jar
```

You should see output like:
```
Started VehicleRentalApplication in X seconds
Tomcat started on port(s): 8080
```

### Step 4: Start the Frontend

```bash
# Navigate to the frontend directory
cd vehicle_rental_frontend

# Install dependencies (if not already done)
pnpm install

# Start the development server
pnpm dev
```

You should see:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 5: Test the Connection

1. Open your browser to `http://localhost:5173`
2. You should see the Vehicle Rental Management System dashboard
3. The sidebar should show all navigation options
4. If the backend is running, you'll see data loading
5. If the backend isn't running, you'll see an error message (which is expected)

## ✅ Verification Checklist

### Frontend is Working
- [ ] Page loads without JavaScript errors
- [ ] Sidebar navigation is visible
- [ ] All menu items are clickable
- [ ] Pages load without 404 errors

### Backend Connection is Working
- [ ] Dashboard shows statistics (not error message)
- [ ] Can navigate to Vehicles page and see vehicle list
- [ ] Can add a new vehicle and it appears in the list
- [ ] Can edit and delete vehicles
- [ ] Same operations work for Customers, Rentals, Payments, etc.

### API Requests are Successful
Open browser DevTools (F12 → Network tab) and:
- [ ] See successful requests to `http://localhost:8080/api/*`
- [ ] Responses have status 200, 201, or 204 (not 4xx or 5xx)
- [ ] Response bodies contain expected JSON data

## 🔍 Troubleshooting

### Error: "Failed to load dashboard data"

**Cause:** Backend is not running or not accessible

**Solution:**
1. Check if backend is running: `http://localhost:8080` in browser
2. Verify CORS configuration is added to backend
3. Check `VITE_API_URL` environment variable
4. Look at browser console for specific error messages

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause:** Backend doesn't have CORS enabled

**Solution:**
1. Add the `CorsConfig.java` class shown in Step 2
2. Restart the backend
3. Refresh the frontend

### Error: "Failed to fetch" or "Network error"

**Cause:** Backend URL is incorrect or backend is not running

**Solution:**
1. Verify backend is running: `http://localhost:8080/api/vehicles`
2. Check the `VITE_API_URL` in `.env.local`
3. Ensure no firewall is blocking the connection
4. Check backend logs for errors

### Data not loading on Dashboard

**Cause:** Backend endpoints are not returning data

**Solution:**
1. Check backend logs for errors
2. Verify database is running and accessible
3. Ensure database has test data
4. Check that all entity relationships are correct

### Form submission fails

**Cause:** Backend validation or missing required fields

**Solution:**
1. Check browser console for error details
2. Verify all form fields are filled correctly
3. Check backend logs for validation errors
4. Ensure data types match backend expectations

## 📊 API Endpoint Reference

The frontend expects these endpoints to exist on your backend:

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID
- `GET /api/vehicles/available` - Get available vehicles
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Rentals
- `GET /api/rentals` - Get all rentals
- `GET /api/rentals/{id}` - Get rental by ID
- `POST /api/rentals` - Create new rental
- `POST /api/rentals/{id}/complete` - Complete a rental
- `DELETE /api/rentals/{id}` - Delete rental

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Create new payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment

### Branches
- `GET /api/branches` - Get all branches
- `GET /api/branches/{id}` - Get branch by ID
- `POST /api/branches` - Create new branch
- `PUT /api/branches/{id}` - Update branch
- `DELETE /api/branches/{id}` - Delete branch

### Staff
- `GET /api/staff` - Get all staff
- `GET /api/staff/{id}` - Get staff by ID
- `POST /api/staff` - Create new staff
- `PUT /api/staff/{id}` - Update staff
- `DELETE /api/staff/{id}` - Delete staff

### Maintenance
- `GET /api/maintenances` - Get all maintenance records
- `GET /api/maintenances/{id}` - Get maintenance by ID
- `POST /api/maintenances` - Create new maintenance
- `PUT /api/maintenances/{id}` - Update maintenance
- `DELETE /api/maintenances/{id}` - Delete maintenance

## 🔐 Production Deployment

### Environment Variables for Production

```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend CORS Configuration for Production

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://yourdomain.com", "https://www.yourdomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Building for Production

```bash
cd vehicle_rental_frontend

# Create optimized production build
pnpm build

# Output will be in the 'dist' directory
```

## 📝 Data Format Examples

### Creating a Vehicle

```javascript
POST /api/vehicles
{
  "vehicleType": "Car",
  "brand": "Toyota",
  "model": "Camry",
  "registrationNo": "ABC123",
  "dailyRate": 50.00,
  "availabilityStatus": "Available"
}
```

### Creating a Customer

```javascript
POST /api/customers
{
  "fullName": "John Doe",
  "nicPassportNo": "123456789",
  "licenseNo": "DL123456",
  "phoneNo": "555-1234",
  "email": "john@example.com",
  "address": "123 Main St",
  "username": "johndoe",
  "password": "password123"
}
```

### Creating a Rental

```javascript
POST /api/rentals
{
  "customer": { "customerId": 1 },
  "vehicle": { "vehicleId": 1 },
  "staff": { "staffId": 1 },
  "rentalDate": "2024-01-15",
  "returnDate": "2024-01-20",
  "totalAmount": 250.00,
  "rentalStatus": "Ongoing"
}
```

## 🆘 Getting Help

If you encounter issues:

1. **Check the browser console** (F12 → Console tab) for JavaScript errors
2. **Check the Network tab** (F12 → Network tab) to see API requests and responses
3. **Check backend logs** for server-side errors
4. **Verify the CORS configuration** is correctly added to the backend
5. **Ensure both frontend and backend are running** on the correct ports

## 📚 Additional Resources

- Frontend Setup Guide: See `FRONTEND_SETUP.md`
- Spring Boot CORS Documentation: https://spring.io/guides/gs/rest-service-cors/
- React Documentation: https://react.dev
- Fetch API Documentation: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

**You're all set!** The frontend and backend should now work together seamlessly. 🎉

