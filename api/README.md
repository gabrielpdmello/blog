# Blog REST API
This is the blogs backend, made with Express. 

The most challenging parts when developing this API were planning RESTful routes and how to create and validate JWTs and then use those JWTs for authentication. 

## Built With
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Passport.js with the JWT strategy
- jsonwebtoken
- CORS middleware

## Routes

### Users

| Method | Route         | Description                 |
| ------ | ------------- | --------------------------- |
| GET    | users/        | Get all users               |
| GET    | users/me      | Get logged in user from JWT |
| GET    | users/:userId | Get user from id            |
| POST   | users/        | Create new user             |

### Posts

| Method | Route                  | Description                       |
| ------ | ---------------------- | --------------------------------- |
| GET    | posts/                 | Get all posts                     |
| GET    | posts/:postId          | Get post from id                  |
| GET    | posts/:postId/comments | Get comments from post id         |
| PUT    | posts/:postId/publish  | Change the publish status of post |
| DELETE | posts/:postId          | Delete post with id               |
| POST   | posts/                 | Create new post                   |
| PUT    | posts/:postId          | Update post                       |

### Comments

| Method | Route               | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | comments/           | Get all comments       |
| POST   | comments/           | Add comment            |
| DELETE | comments/:commentId | Delete comment with id |

### Session

| Method | Route         | Description             |
| ------ | ------------- | ----------------------- |
| POST   | session/login | Create new JWT for user |

## How to run this API
1. Clone this repo and cd into API directory
```bash
git clone https://github.com/gabrielpdmello/blog.git
cd blog/api
```
2. Install dependencies
```bash
npm install
```
3. Create a PostgreSQL database
4. Copy the example environment file
```bash
cp .env.example .env
```
5. Update the environment variables
6. Run the Prisma migrations:
```bash
npx prisma migrate dev
npx prisma generate
```
7. Optionally, seed the database
```bash
npx prisma db seed
```
8. Start the application
```bash
npm run start
```
