# Vehicle Rental System - React Frontend Setup Guide

This is a comprehensive React frontend for the Vehicle Rental Management System, built with React 19, TypeScript, Tailwind CSS, and shadcn/ui components.

## 📋 Project Overview

The frontend provides a complete management interface for:
- **Vehicles**: Add, edit, delete, and track vehicle inventory
- **Customers**: Manage customer information and profiles
- **Rentals**: Create and manage rental bookings
- **Payments**: Track payment records and status
- **Branches**: Manage rental branch locations
- **Staff**: Manage staff members and assignments
- **Maintenance**: Track vehicle maintenance and service records
- **Dashboard**: View system statistics and overview

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Spring Boot backend running (see Backend Integration section)

### Installation

1. **Install dependencies**
   ```bash
   cd vehicle_rental_frontend
   pnpm install
   ```

2. **Configure API URL**
   
   The frontend needs to know where your Spring Boot backend is running. You can set this in two ways:

   **Option A: Environment Variable (Recommended)**
   ```bash
   # Create a .env.local file in the project root
   VITE_API_URL=http://localhost:8080/api
   ```

   **Option B: Update in code** (if .env doesn't work)
   - Edit `client/src/lib/api.ts`
   - Change the `API_BASE_URL` constant

3. **Start the development server**
   ```bash
   pnpm dev
   ```

   The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use)

## 🔗 Backend Integration

### API Endpoints Expected

The frontend communicates with the following Spring Boot API endpoints:

| Resource | Base URL | Operations |
|----------|----------|-----------|
| Vehicles | `/api/vehicles` | GET, POST, PUT, DELETE, GET /available |
| Branches | `/api/branches` | GET, POST, PUT, DELETE |
| Customers | `/api/customers` | GET, POST, PUT, DELETE |
| Staff | `/api/staff` | GET, POST, PUT, DELETE |
| Rentals | `/api/rentals` | GET, POST, DELETE, POST /{id}/complete |
| Payments | `/api/payments` | GET, POST, PUT, DELETE |
| Maintenance | `/api/maintenances` | GET, POST, PUT, DELETE |

### CORS Configuration

**Important**: Your Spring Boot backend must have CORS enabled to accept requests from the frontend.

Add this to your Spring Boot application:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Running the Backend

Ensure your Spring Boot application is running:

```bash
# In your Spring Boot project directory
mvn spring-boot:run
# or
java -jar target/vehicle-rental-0.0.1-SNAPSHOT.jar
```

By default, it should run on `http://localhost:8080`

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── Sidebar.tsx # Navigation sidebar
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Vehicles.tsx
│   │   ├── Customers.tsx
│   │   ├── Rentals.tsx
│   │   ├── Payments.tsx
│   │   ├── Branches.tsx
│   │   ├── Staff.tsx
│   │   └── Maintenance.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useApi.ts   # API data fetching hooks
│   ├── lib/            # Utility functions
│   │   └── api.ts      # API service layer
│   ├── contexts/       # React contexts
│   ├── App.tsx         # Main app component with routing
│   ├── main.tsx        # React entry point
│   └── index.css       # Global styles
├── package.json
└── tsconfig.json
```

## 🔧 Key Features

### 1. **API Service Layer** (`client/src/lib/api.ts`)
- Centralized API communication
- Organized endpoints for each resource
- Error handling and response parsing

### 2. **Custom Hooks** (`client/src/hooks/useApi.ts`)
- `useApi()`: For fetching data with loading and error states
- `useMutation()`: For create/update/delete operations

### 3. **Dashboard**
- Overview statistics (total vehicles, customers, rentals, revenue)
- System status indicator
- API connectivity check

### 4. **CRUD Pages**
Each resource has a dedicated page with:
- List view with data table
- Add/Edit dialog forms
- Delete functionality
- Real-time data refresh

### 5. **Navigation**
- Responsive sidebar navigation
- Mobile-friendly menu toggle
- Active route highlighting

## 🎨 Styling

The frontend uses:
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Custom theme**: Light theme with blue accents

To customize colors, edit `client/src/index.css` and update the CSS variables in the `:root` selector.

## 🧪 Testing the Integration

### Step 1: Start the Backend
```bash
# In your Spring Boot project
mvn spring-boot:run
```

### Step 2: Start the Frontend
```bash
# In the vehicle_rental_frontend directory
pnpm dev
```

### Step 3: Test API Connection
1. Open the frontend at `http://localhost:5173`
2. Navigate to the Dashboard
3. You should see statistics loading from the backend
4. Check the browser console for any API errors

### Step 4: Test CRUD Operations
1. Go to the Vehicles page
2. Click "Add Vehicle"
3. Fill in the form and submit
4. The vehicle should appear in the list

If you see errors, check:
- Backend is running on the correct port
- CORS is properly configured
- API_URL environment variable is correct
- Network tab in browser DevTools for failed requests

## 🔐 Security Notes

- The frontend currently sends data in plain JSON
- For production, implement:
  - HTTPS/TLS encryption
  - Authentication (JWT tokens)
  - Input validation and sanitization
  - CSRF protection
  - Rate limiting

## 📦 Building for Production

```bash
# Build the optimized production bundle
pnpm build

# Preview the production build locally
pnpm preview
```

The build output will be in the `dist/` directory.

## 🐛 Troubleshooting

### "Failed to load data" error
- Check if backend is running
- Verify API URL in environment variables
- Check browser console for specific error messages
- Ensure CORS is enabled on backend

### CORS errors
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```
- Add CORS configuration to Spring Boot (see Backend Integration section)

### Blank page or no data loading
- Check browser console for JavaScript errors
- Verify API_URL environment variable is set correctly
- Check Network tab to see if API requests are being made

### Form submission fails
- Check backend validation rules
- Ensure all required fields are filled
- Verify data types match backend expectations
- Check browser console for error details

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api` |

## 🤝 API Integration Details

### Request Format
All requests use JSON format with proper headers:
```javascript
{
  "Content-Type": "application/json"
}
```

### Response Handling
- Success responses (2xx): Parsed as JSON
- 204 No Content: Handled as successful deletion
- Error responses (4xx, 5xx): Error message extracted and displayed

### Data Models

#### Vehicle
```json
{
  "vehicleId": 1,
  "vehicleType": "Car",
  "brand": "Toyota",
  "model": "Camry",
  "registrationNo": "ABC123",
  "dailyRate": 50.00,
  "availabilityStatus": "Available"
}
```

#### Customer
```json
{
  "customerId": 1,
  "fullName": "John Doe",
  "nicPassportNo": "123456789",
  "licenseNo": "DL123456",
  "phoneNo": "555-1234",
  "email": "john@example.com",
  "address": "123 Main St",
  "username": "johndoe"
}
```

#### Rental
```json
{
  "rentalId": 1,
  "customer": { "customerId": 1 },
  "vehicle": { "vehicleId": 1 },
  "staff": { "staffId": 1 },
  "rentalDate": "2024-01-15",
  "returnDate": "2024-01-20",
  "totalAmount": 250.00,
  "rentalStatus": "Ongoing"
}
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Wouter Router Documentation](https://github.com/molefrog/wouter)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify backend API is accessible
4. Check that all required data fields are populated

---

**Happy coding!** 🚀

