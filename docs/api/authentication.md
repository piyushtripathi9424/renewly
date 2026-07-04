# Authentication Flow

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database

    User->>Frontend: Enter credentials
    Frontend->>API: POST /auth/login
    API->>Database: Verify User & Password
    Database-->>API: User details
    API->>API: Generate Access & Refresh Tokens
    API->>Database: Store hashed refresh token
    API-->>Frontend: Set HttpOnly Cookies (Access + Refresh)
    
    User->>Frontend: Access Protected Route
    Frontend->>API: GET /auth/me (with cookies)
    API-->>Frontend: Return User details
    
    User->>Frontend: Access token expires
    Frontend->>API: Request with expired token
    API-->>Frontend: 401 Unauthorized
    Frontend->>API: POST /auth/refresh (with refresh cookie)
    API->>Database: Verify hashed refresh token
    API->>API: Generate new tokens
    API-->>Frontend: Set new HttpOnly Cookies
    Frontend->>API: Retry original request
    API-->>Frontend: Success
```

## Environment Variables

Ensure the following environment variables are set in your `.env` files:

**API**
```env
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
FRONTEND_URL=http://localhost:5173
```

**Frontend**
```env
VITE_API_URL=http://localhost:3000
```

## API Documentation

### POST `/auth/register`
Creates a new user.
- **Body**: `{ email, password, name? }`

### POST `/auth/login`
Authenticates a user.
- **Body**: `{ email, password }`
- **Response**: Sets HttpOnly cookies.

### POST `/auth/refresh`
Refreshes the access token using the refresh token cookie.

### GET `/auth/me`
Returns the current authenticated user's details.

### POST `/auth/logout`
Logs out the user and clears cookies.
