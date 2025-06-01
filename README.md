# Community Roles API

A robust REST API for managing community roles, members, and authentication built with Bun, TypeScript, and Prisma.

## 🚀 Features

- User Authentication (Signup/Signin)
- Community Management
- Role Management
- Member Management
- JWT-based Authentication
- Pagination Support
- Input Validation
- Error Handling

## 📋 Prerequisites

- [Bun](https://bun.sh) (v1.2.15 or higher)
- [Node.js](https://nodejs.org) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org) database

## 🔧 Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd community-roles
```

2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/community_roles"
JWT_SECRET="your-secret-key"
```

4. Initialize the database:
```bash
bunx prisma generate
bunx prisma db push
```

5. Start the server:
```bash
bun run index.ts
```

The server will start running on `http://localhost:3000`

## 📚 API Documentation

### Authentication APIs

#### 1. Sign Up
- **Endpoint:** `POST /v1/auth/signup`
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** User details with access token

#### 2. Sign In
- **Endpoint:** `POST /v1/auth/signin`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** User details with access token

#### 3. Get User Profile
- **Endpoint:** `GET /v1/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User profile details

### Community APIs

#### 4. Create Community
- **Endpoint:** `POST /v1/community`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Response:** Created community details

#### 5. Get All Communities
- **Endpoint:** `GET /v1/community`
- **Query Parameters:** `page` (optional)
- **Response:** Paginated list of communities

#### 6. Get My Owned Communities
- **Endpoint:** `GET /v1/community/me/owner`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** `page` (optional)
- **Response:** Paginated list of owned communities

#### 7. Get My Joined Communities
- **Endpoint:** `GET /v1/community/me/member`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** List of joined communities

#### 8. Get Community Members
- **Endpoint:** `GET /v1/community/:communityId/members`
- **Response:** List of community members

### Role APIs

#### 9. Create Role
- **Endpoint:** `POST /v1/role`
- **Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Response:** Created role details

#### 10. Get All Roles
- **Endpoint:** `GET /v1/role`
- **Response:** List of all roles

### Member APIs

#### 11. Add Member
- **Endpoint:** `POST /v1/member`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "community": "string",
    "user": "string",
    "role": "string"
  }
  ```
- **Response:** Added member details

#### 12. Remove Member
- **Endpoint:** `DELETE /v1/member/:memberId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📝 Response Format

All API responses follow this format:
```json
{
  "status": boolean,
  "content": {
    "data": object | array,
    "meta": {
      "total": number,
      "pages": number,
      "page": number
    }
  }
}
```

## 🛠️ Error Handling

Errors are returned in the following format:
```json
{
  "status": false,
  "error": "Error message"
}
```

## 📦 Dependencies

- Bun
- TypeScript
- Prisma
- JWT
- PostgreSQL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License.
