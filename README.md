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
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2024-03-20T10:00:00Z"
      },
      "meta": {
        "access_token": "jwt_token_here"
      }
    }
  }
  ```

#### 2. Sign In
- **Endpoint:** `POST /v1/auth/signin`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2024-03-20T10:00:00Z"
      },
      "meta": {
        "access_token": "jwt_token_here"
      }
    }
  }
  ```

#### 3. Get User Profile
- **Endpoint:** `GET /v1/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2024-03-20T10:00:00Z"
      }
    }
  }
  ```

### Community APIs

#### 4. Create Community
- **Endpoint:** `POST /v1/community`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Tech Enthusiasts"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "community_id",
        "name": "Tech Enthusiasts",
        "slug": "tech-enthusiasts",
        "owner": {
          "id": "user_id",
          "name": "John Doe"
        },
        "created_at": "2024-03-20T10:00:00Z",
        "updated_at": "2024-03-20T10:00:00Z"
      }
    }
  }
  ```

#### 5. Get All Communities
- **Endpoint:** `GET /v1/community`
- **Query Parameters:** `page` (optional, default: 1)
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "meta": {
        "total": 100,
        "pages": 10,
        "page": 1
      },
      "data": [
        {
          "id": "community_id",
          "name": "Tech Enthusiasts",
          "slug": "tech-enthusiasts",
          "owner": {
            "id": "user_id",
            "name": "John Doe"
          },
          "created_at": "2024-03-20T10:00:00Z",
          "updated_at": "2024-03-20T10:00:00Z"
        }
      ]
    }
  }
  ```

#### 6. Get My Owned Communities
- **Endpoint:** `GET /v1/community/me/owner`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** `page` (optional, default: 1)
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "meta": {
        "total": 5,
        "pages": 1,
        "page": 1
      },
      "data": [
        {
          "id": "community_id",
          "name": "Tech Enthusiasts",
          "slug": "tech-enthusiasts",
          "created_at": "2024-03-20T10:00:00Z",
          "updated_at": "2024-03-20T10:00:00Z"
        }
      ]
    }
  }
  ```

#### 7. Get My Joined Communities
- **Endpoint:** `GET /v1/community/me/member`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": [
        {
          "id": "community_id",
          "name": "Tech Enthusiasts",
          "slug": "tech-enthusiasts",
          "role": "member",
          "created_at": "2024-03-20T10:00:00Z"
        }
      ]
    }
  }
  ```

#### 8. Get Community Members
- **Endpoint:** `GET /v1/community/:communityId/members`
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": [
        {
          "id": "member_id",
          "community": {
            "id": "community_id",
            "name": "Tech Enthusiasts"
          },
          "user": {
            "id": "user_id",
            "name": "John Doe"
          },
          "role": {
            "id": "role_id",
            "name": "member"
          },
          "created_at": "2024-03-20T10:00:00Z"
        }
      ]
    }
  }
  ```

### Role APIs

#### 9. Create Role
- **Endpoint:** `POST /v1/role`
- **Request Body:**
  ```json
  {
    "name": "moderator"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "role_id",
        "name": "moderator",
        "created_at": "2024-03-20T10:00:00Z"
      }
    }
  }
  ```

#### 10. Get All Roles
- **Endpoint:** `GET /v1/role`
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "meta": {
        "total": 3,
        "pages": 1,
        "page": 1
      },
      "data": [
        {
          "id": "role_id",
          "name": "admin",
          "created_at": "2024-03-20T10:00:00Z"
        },
        {
          "id": "role_id",
          "name": "moderator",
          "created_at": "2024-03-20T10:00:00Z"
        },
        {
          "id": "role_id",
          "name": "member",
          "created_at": "2024-03-20T10:00:00Z"
        }
      ]
    }
  }
  ```

### Member APIs

#### 11. Add Member
- **Endpoint:** `POST /v1/member`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "community": "community_id",
    "user": "user_id",
    "role": "role_id"
  }
  ```
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "member_id",
        "community": {
          "id": "community_id",
          "name": "Tech Enthusiasts"
        },
        "user": {
          "id": "user_id",
          "name": "John Doe"
        },
        "role": {
          "id": "role_id",
          "name": "member"
        },
        "created_at": "2024-03-20T10:00:00Z"
      }
    }
  }
  ```

#### 12. Remove Member
- **Endpoint:** `DELETE /v1/member/:memberId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "success": true
      }
    }
  }
  ```

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
