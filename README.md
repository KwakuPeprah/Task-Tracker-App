# TaskTracker

A simple Node.js/Express/MongoDB application for tracking tasks and posts, with user authentication and email verification. This project is designed for learning purposes and demonstrates RESTful API design, authentication, validation, and MongoDB integration.

## Features

- User registration with email verification
- User login and JWT authentication
- Create, read, update, and view posts
- Input validation using Joi
- Password hashing with bcryptjs
- MongoDB data storage with Mongoose
- Secure HTTP headers with Helmet
- CORS enabled for API access

## Project Structure

```
TaskTracker/
│   index.js
│   package.json
│
├───controllers/
│       authenticationCont.js
│       postsController.js
│
├───middlewares/
│       validator.js
│
├───models/
│       postsModel.js
│       usersModel.js
│
├───routers/
│       authenticationRouter.js
│       postsRouter.js
│
├───utils/
│       hashing.js
│       mailer.js
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd TaskTracker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   MONGO_URI=<your-mongodb-connection-string>
   TOKEN_SECRET=<your-jwt-secret>
   GMAIL_EMAIL=<your-gmail-address>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   GOOGLE_REDIRECT_URI=<your-google-redirect-uri>
   GOOGLE_REFRESH_TOKEN=<your-google-refresh-token>
   ```

### Running the App

```sh
npm run dev
```

The server will start on the port specified in your `.env` file (default: 8000).

## API Endpoints

### Authentication

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/signin` — Login and receive JWT
- `POST /api/auth/signout` — Logout
- `GET /api/auth/verify-email?token=...` — Verify user email

### Posts

- `GET /api/posts/all-posts?page=1` — Get paginated posts
- `POST /api/posts/create-post` — Create a new post
- `GET /api/posts/single-post?_id=<postId>` — Get a single post by ID
- `PUT /api/posts/update-post/:id` — Update a post by ID

## Example Postman Request

**Create Post:**

```
POST /api/posts/create-post
Content-Type: application/json
{
  "title": "My First Post",
  "description": "This is a test post.",
  "userid": "<userId>"
}
```

## Learning Objectives

- Understand RESTful API design
- Implement authentication and authorization
- Use Mongoose for MongoDB data modeling
- Validate input with Joi
- Send emails with Nodemailer and Google OAuth2

## License

This project is for practice and educational purposes only.
