# Finance Dashboard Backend API

A role-based access control (RBAC) backend for a finance dashboard system. Supports user management, financial record tracking, and comprehensive analytics with role-based permissions.

## Overview

This backend provides a complete API for managing financial records with different user roles (Viewer, Analyst, Admin). It includes authentication, authorization, data validation, and summary analytics tailored to different user permissions.

**Live API Documentation:** Available at `/api-docs` (Swagger UI)

---

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC) with three roles:
  - **Viewer**: Can only view their own records and basic summaries
  - **Analyst**: Can view records, access insights, and generate reports
  - **Admin**: Full management access (create/update/delete records and users)
- Secure password hashing with bcrypt
- Default admin account auto-creation on first run

### 💰 Financial Records Management
- Create, read, update, and delete financial records
- Support for income and expense types
- Categorization with custom categories
- Flexible filtering by:
  - Date range (startDate, endDate)
  - Record type (income/expense)
  - Category
- Pagination with configurable limits
- Soft delete functionality (paranoid mode)
- User-scoped data (each user only sees their own records)

### 📊 Analytics & Summaries
- **Total Income & Expenses**: Quick overview of financial summary
- **Net Balance**: Calculated total balance
- **Category-wise Totals**: Breakdown by spending/income category
- **Monthly Trends**: Income and expense trends by month
- **Weekly Trends**: Weekly aggregation for shorter-term analysis
- **Recent Activity**: Latest records for quick reference

### 👥 User Management
- Create users with role assignment
- List all users (admin only)
- Update user roles and status
- Deactivate/reactivate users
- User registration (defaults to Viewer role)

### ✅ Validation & Error Handling
- Email validation on registration and user creation
- Amount validation (positive numbers, proper format)
- Date validation and range checking
- Comprehensive error messages with appropriate HTTP status codes
- Input sanitization for search and filter parameters
- Request payload validation on all endpoints

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (via Sequelize ORM)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **API Documentation**: Swagger/OpenAPI 3.0
- **Environment Management**: dotenv

---

## Project Structure

```
├── config/
│   ├── db.js                 # Sequelize database configuration
│   └── swagger.js            # Swagger/OpenAPI setup
├── controllers/
│   ├── authController.js     # Login & registration
│   ├── recordController.js   # Record CRUD & filtering
│   ├── dashboardController.js # Analytics & summaries
│   └── userController.js     # User management
├── middleware/
│   ├── auth.js               # JWT verification
│   ├── errorHandler.js       # Global error handling
│   └── role.js               # Role-based access control
├── models/
│   ├── User.js               # User schema
│   ├── Record.js             # Financial record schema
│   └── index.js              # Model associations
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── recordRoutes.js       # Record endpoints
│   ├── userRoutes.js         # User management endpoints
│   └── dashboardRoutes.js    # Analytics endpoints
├── utils/
│   └── response.js           # Response formatting utilities
├── app.js                    # Express app configuration
├── server.js                 # Entry point
├── .env.example              # Environment variables template
└── database.sqlite           # SQLite database (auto-created)
```

---

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd finance-dashboard-backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
NODE_ENV=development
```

For production, use a strong, random JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Setup & Run

```bash
npm start
```

On first run, the system will:
- Initialize the SQLite database
- Create all tables
- Generate a default admin account
- Display admin credentials in the console

**⚠️ Important:** Save the default admin password displayed on first run. You'll need it to log in.

---

## API Endpoints

### Authentication

#### Register (Public)
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- Creates a new user with **Viewer** role by default
- Password must be at least 6 characters
- Email must be unique and valid
- Response: `201 Created` with user object

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- Response: `200 OK` with JWT token
- Use token in Authorization header: `Bearer <token>`

---

### Records Management

#### Create Record (Admin only)
```http
POST /records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15",
  "note": "Monthly salary"
}
```
- **Fields**:
  - `amount` (number, required): Must be positive
  - `type` (enum, required): "income" or "expense"
  - `category` (string, required): Category name
  - `date` (ISO date, optional): Defaults to today
  - `note` (string, optional): Description
- Response: `201 Created` with record details

#### Get All Records (Authenticated)
```http
GET /records?page=1&limit=10&category=Salary&type=income&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Records per page (default: 10)
  - `category` (string): Filter by category
  - `type` (string): Filter by "income" or "expense"
  - `startDate` (ISO date): Filter records from this date
  - `endDate` (ISO date): Filter records until this date
- **Access**: Users see only their own records
- Response: `200 OK` with paginated records and total count

#### Update Record (Admin only)
```http
PUT /records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5500,
  "category": "Updated Salary",
  "note": "Revised amount"
}
```
- Only admin can update
- Partial updates supported
- Response: `200 OK` with updated record

#### Delete Record (Admin only)
```http
DELETE /records/:id
Authorization: Bearer <token>
```
- Soft delete (record remains in database with deletedAt timestamp)
- Response: `200 OK` with success message

---

### Dashboard & Analytics

#### Summary (Analyst & Admin)
```http
GET /dashboard/summary
Authorization: Bearer <token>
```
- Response:
```json
{
  "totalIncome": 50000,
  "totalExpense": 15000,
  "netBalance": 35000
}
```

#### Category-wise Totals (Analyst & Admin)
```http
GET /dashboard/category-summary
Authorization: Bearer <token>
```
- Response:
```json
{
  "categories": [
    { "category": "Salary", "total": 50000, "type": "income" },
    { "category": "Groceries", "total": 5000, "type": "expense" }
  ]
}
```

#### Monthly Trends (Analyst & Admin)
```http
GET /dashboard/monthly-trends?year=2024
Authorization: Bearer <token>
```
- **Query Parameters**:
  - `year` (number, optional): Year to analyze (default: current year)
- Response:
```json
{
  "trends": [
    { "month": "January", "income": 50000, "expense": 10000 },
    { "month": "February", "income": 45000, "expense": 12000 }
  ]
}
```

#### Weekly Trends (Analyst & Admin)
```http
GET /dashboard/weekly-trends?weeks=12
Authorization: Bearer <token>
```
- **Query Parameters**:
  - `weeks` (number, optional): Number of weeks to show (default: 12)
- Response:
```json
{
  "trends": [
    { "week": "Week 1", "income": 12000, "expense": 2500 },
    { "week": "Week 2", "income": 13000, "expense": 2800 }
  ]
}
```

#### Recent Activity (Analyst & Admin)
```http
GET /dashboard/recent-activity?limit=10
Authorization: Bearer <token>
```
- Shows latest records across all users
- **Query Parameters**:
  - `limit` (number, optional): Number of records (default: 10)
- Response: Array of recent records

---

### User Management (Admin only)

#### Create User
```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123",
  "role": "analyst"
}
```
- `role` can be: "viewer", "analyst", or "admin"
- Response: `201 Created` with user object

#### List All Users
```http
GET /users
Authorization: Bearer <token>
```
- Admin only
- Response: Array of all users with their roles and status

#### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "analyst",
  "isActive": true
}
```
- Can update role and active status
- Response: `200 OK` with updated user

#### Deactivate User
```http
PATCH /users/:id/deactivate
Authorization: Bearer <token>
```
- Sets `isActive` to false
- Deactivated users cannot log in
- Response: `200 OK` with success message

---

## Role Permissions Matrix

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Register | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ |
| View own records | ✅ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| View summary | ❌ | ✅ | ✅ |
| View trends | ❌ | ✅ | ✅ |
| View category summary | ❌ | ✅ | ✅ |
| Create users | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### Common Status Codes

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or missing fields
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions for action
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Example Error Responses

**Invalid credentials:**
```json
{ "message": "Invalid credentials" }
// Status: 400
```

**Insufficient permissions:**
```json
{ "message": "Forbidden" }
// Status: 403
```

**Missing required fields:**
```json
{ "message": "All fields required" }
// Status: 400
```

---

## Validation Rules

### User Registration/Creation
- **Name**: Required, non-empty string
- **Email**: Required, valid email format, unique in system
- **Password**: Required, minimum 6 characters
- **Role**: Must be one of: "viewer", "analyst", "admin"

### Financial Records
- **Amount**: Required, must be positive number, decimal allowed
- **Type**: Required, must be "income" or "expense"
- **Category**: Required, non-empty string
- **Date**: Optional, must be valid ISO date format (YYYY-MM-DD)
- **Note**: Optional, string

### Filters & Pagination
- **Page**: Must be positive integer (min: 1)
- **Limit**: Must be positive integer (min: 1, max: 100)
- **Date Range**: startDate must be before endDate

---

## Data Persistence

### Database: SQLite
- File-based database stored at `./database.sqlite`
- Automatically created on first run
- All data persisted between server restarts

### Models

**User**
```
- id (primary key)
- name
- email (unique)
- password (hashed)
- role (viewer | analyst | admin)
- isActive
- createdAt
- updatedAt
```

**Record**
```
- id (primary key)
- userId (foreign key)
- amount
- type (income | expense)
- category
- date
- note
- createdAt
- updatedAt
- deletedAt (soft delete)
```

---

## Security Features

✅ **Password Security**
- Bcrypt hashing with salt rounds
- Passwords never stored in plain text

✅ **Authentication**
- JWT-based stateless authentication
- Token validation on every protected endpoint

✅ **Authorization**
- Role-based access control middleware
- Fine-grained permission checks per route

✅ **Input Validation**
- All inputs validated before processing
- Email format validation
- Amount and date validation
- Enum validation for type and role fields

✅ **Data Isolation**
- Users only access their own records
- No cross-user data leakage

✅ **Error Handling**
- Sensitive information not exposed in error messages
- Proper HTTP status codes

---

## Development

### Running the Server

```bash
npm start
```

Server runs on `http://localhost:5000`

### API Documentation

Visit `http://localhost:5000/api-docs` for interactive Swagger documentation.

### Default Admin Credentials

On first run, admin credentials are printed to console:
```
🚀 DEFAULT ADMIN CREATED
=================================
📧 Email: admin@system.com
🔑 Password: <random-12-char-password>
⚠️  Save this password now. It won't be shown again.
=================================
```

---

## Example Workflow

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "myPassword123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "myPassword123"
  }'
# Returns: { "token": "eyJhbGc..." }
```

### 3. View your records (as viewer)
```bash
curl http://localhost:5000/records \
  -H "Authorization: Bearer eyJhbGc..."
```

### 4. Login as admin and create a record
```bash
curl -X POST http://localhost:5000/records \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "note": "Monthly salary"
  }'
```

### 5. View analytics (as analyst)
```bash
curl http://localhost:5000/dashboard/summary \
  -H "Authorization: Bearer <analyst-token>"
```

---

## Assumptions & Design Decisions

### 1. Role Defaults
- New users via registration default to **Viewer** role
- Only admins can create other roles through the user management API

### 2. Record Ownership
- Each record is tied to the user who created it (userId)
- Users can only see their own records (enforced in getAll endpoint)
- Admin users can see all records via analytics endpoints

### 3. Soft Deletes
- Records are soft-deleted (marked with deletedAt timestamp)
- Deleted records don't appear in queries but remain in database
- Allows data recovery if needed

### 4. Timestamps
- All records and users have createdAt and updatedAt timestamps
- Useful for audit trails and sorting

### 5. Date Handling
- Dates stored as ISO 8601 format
- Default date for records is the creation date
- Date range filtering uses ISO format (YYYY-MM-DD)

### 6. Authentication
- JWT tokens have no expiration set (stateless)
- For production, consider adding token expiration and refresh logic

### 7. Database Choice
- SQLite chosen for simplicity and easy local development
- Easily scalable to PostgreSQL or MySQL by changing Sequelize dialect

### 8. Email as Unique Identifier
- Email is the primary login mechanism
- Email must be unique across the system

---

## Future Enhancements

- [ ] Token expiration and refresh token logic
- [ ] Rate limiting on authentication endpoints
- [ ] Audit logging for all financial record changes
- [ ] Recurring transactions support
- [ ] Budget limits and alerts
- [ ] Multi-currency support
- [ ] File exports (CSV, PDF)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] API key support for third-party integrations

---

## Troubleshooting

### Token not working
- Ensure token is included in `Authorization: Bearer <token>` format
- Check that JWT_SECRET in `.env` matches the one used to sign tokens
- Tokens are case-sensitive

### Permission Denied (403)
- Verify your user role has access to this endpoint
- Check role permissions matrix above

### User not found (404)
- Email might be case-sensitive in your system
- Verify user exists and is active

### Database locked
- Ensure only one instance of the server is running
- Delete `database.sqlite` and restart if corrupted

---

## License

This project is provided as-is for educational and assessment purposes.

---

## Support

For issues or questions about the API:
1. Check the Swagger documentation at `/api-docs`
2. Review this README for endpoint specifications
3. Check error messages for validation details

---

**Created**: January 2024  
**Last Updated**: April 2026
