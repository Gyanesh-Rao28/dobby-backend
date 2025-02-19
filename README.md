# User Authentication API

A RESTful API for user authentication and management built with Express.js and MongoDB.

## Features

- User registration and authentication
- JWT-based authorization
- User search functionality
- Password hashing with bcrypt
- MongoDB integration
- Input validation
- Secure password handling

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT)
- bcrypt

## Prerequisites

- Node.js (v20.x or later)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Gyanesh-Rao28/toposel.git
   cd toposel
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Environment Variables

   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   CORS_ORIGIN=*
   JWT_EXPIRY=7d
   JWT_SECRET=your_jwt_secret_key
   MONGO_URL=mongodb+srv://<UserName>:<Password>@cluster0.ylosiqb.mongodb.net
   ```

4. Start the server
   ```bash
   npm start
   ```

## API Endpoints

### 1. Register User
Creates a new user account.

- **URL**: `/api/v1/users`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "gender": "male",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "country": "USA"
}
```

#### Success Response
- **Code**: 201 CREATED
- **Content**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "....",
      "username": "johndoe",
      // ... other user fields
    }
  },
  "message": "User registered successfully"
}
```

### 2. User Login
Authenticates a user and returns a JWT token.

- **URL**: `/api/v1/users`
- **Method**: `GET`
- **Content-Type**: `application/json`

#### Request Body
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

#### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "user": {
      // user details
    },
    "token": "jwt_token_here"
  },
  "message": "User logged in successfully"
}
```

### 3. Search Users
Search for users by username or email (requires authentication).

- **URL**: `/api/v1/users/search`
- **Method**: `POST`
- **Headers**: 
  - `Authorization: Bearer your_jwt_token`
- **Query Parameters**: 
  - `name`: Search term for username/email

#### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "username": "...",
      // ... other user fields
    }
  ],
  "message": "Users fetched successfully"
}
```

### 4. Get All Users
Retrieve a list of all users.

- **URL**: `/api/v1/users/allUsers`
- **Method**: `GET`

#### Success Response
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "username": "...",
      "email": "...",
      "fullName": "...",
      "gender": "...",
      "dateOfBirth": "...",
      "country": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "message": "Users fetched successfully"
}
```

## Error Responses

```json
{
  "success": false,
  "message": "Error message here"
}
```

