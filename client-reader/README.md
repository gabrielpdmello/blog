# Reader Client
Client used to access blog posts.

## Features
- Sign up and sign in
- View posts
- Post comments
- Delete own comments

## How to run this project
1. Clone this repo and cd into client directory
```bash
git clone https://github.com/gabrielpdmello/blog.git
cd blog/client-reader
```
2. Install dependencies
```bash
npm install
```
3. Copy the example environment file
```bash
cp .env.example .env
```
4. Update the environment variables
5. Start the application
```bash
npm run start
```
## Challenges
My biggest challenge while developing this project was handling client-side authentication. To solve this, I created:

- AuthContext: a React context that stores authentication-related data and functions.

- AuthProvider: a component that provides authentication data and functions through AuthContext.

- useAuth: a custom React hook that simplifies access to AuthContext. Instead of importing and calling useContext, components can simply use useAuth().

- api: a function for making authenticated API requests. It is used internally by the useApi hook.

- useApi: a custom hook that combines api and useAuth. Components use this hook to make authenticated requests.

- ProtectedRoute: a component that protects private routes by redirecting users to /login when not logged in. It is used as a wrapper around protected route components.

- For non authenticated requests, fetch is used.
