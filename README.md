
````md
# Vehicle Rental Management System API

**Live URL:** https://rental-ten-zeta.vercel.app/

A backend REST API for managing a vehicle rental system with **authentication, role-based access control, vehicle inventory, and bookings**.

---

## Features

- JWT Authentication (Signup / Signin)
- Role-Based Access: **Admin & Customer**
- Vehicle Inventory Management
- Booking System with:
  - Auto price calculation
  - Auto vehicle availability update
- Business Rules:
  - Users & vehicles cannot be deleted if they have **active bookings**

---

## Technology Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **JWT & bcrypt**
- **Postman (API Testing)**
- **Vercel (Deployment)**

---

## Setup & Run

### 1. Install Dependencies
```bash
npm install
````

### 2. Environment Variables (`.env`)

```env
PORT=8000
DATABASE_URL=postgresql://username:password@localhost:5432/vehicledb
JWT_SECRET=supersecretkey
```

### 3. Run Project

```bash
npm run dev
```

---

## Auth Header

```
Authorization: Bearer <your_jwt_token>
```

---

# API Endpoints Summary

| Module   | Method | Endpoint                    | Access           |
| -------- | ------ | --------------------------- | ---------------- |
| Auth     | POST   | /api/v1/auth/signup         | Public           |
| Auth     | POST   | /api/v1/auth/signin         | Public           |
| Users    | GET    | /api/v1/users               | Admin            |
| Users    | PUT    | /api/v1/users/:userId       | Admin / Self     |
| Users    | DELETE | /api/v1/users/:userId       | Admin            |
| Vehicles | POST   | /api/v1/vehicles            | Admin            |
| Vehicles | GET    | /api/v1/vehicles            | Public           |
| Vehicles | GET    | /api/v1/vehicles/:vehicleId | Public           |
| Vehicles | PUT    | /api/v1/vehicles/:vehicleId | Admin            |
| Vehicles | DELETE | /api/v1/vehicles/:vehicleId | Admin            |
| Bookings | POST   | /api/v1/bookings            | Admin / Customer |
| Bookings | GET    | /api/v1/bookings            | Admin / Customer |
| Bookings | PUT    | /api/v1/bookings/:bookingId | Admin / Customer |

---

# Sample API Usage

### Signup

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01712345678",
  "role": "customer"
}
```

---

### Create Vehicle (Admin)

```json
{
  "vehicle_name": "Toyota Camry",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

---

### Create Booking

```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2025-01-15",
  "rent_end_date": "2025-01-20"
}
```

---

## Business Logic

```
total_price = daily_rent_price × number_of_days
```

* Booking → vehicle becomes `booked`
* Cancel / Return → vehicle becomes `available`
