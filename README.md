# Writer's Haven - Express Server

Welcome to the backend part of Writer's Haven - an online platform for writers to share their thoughts and creations. This Express server provides the backend functionality for the Writer's Haven application. Here, writers can register, login, create, update, and delete their posts. The server also handles user authentication and authorization, ensuring a secure experience for all users.
## Features
- User Registration: Writers can sign up for a new account with a unique username and email. Passwords are securely hashed before being stored in the database
- User Login: Registered users can log in to their accounts using their email and password. A JSON Web Token (JWT) is generated upon successful login for authorization purposes.
- User Profile: Authenticated users can access their profile information, including username and email, using their JWT.
- Create Post: Logged-in writers can create new posts by providing a book name, writer name, descriptions, and optional image upload
- Update Post: Writers can edit their own posts, updating the book name, writer name, descriptions, and image as required.
- Delete Post: Writers can delete their own posts, removing them from the platform.
- View All Posts: All users can view all the posts shared by various writers.
- View Own Posts: Writers can view a list of their own posts.
## Technologies Used
- Node.js: Backend server runtime environment.
- Express.js: Web application framework for Node.js.
- MongoDB: NoSQL database for storing user and post data.
- Mongoose: MongoDB object modeling for Node.js.
- JWT (JSON Web Token): For user authentication and authorization.
- Bcrypt.js: For secure password hashing.
- Nodemailer (commented in the code): For sending emails (e.g., for account verification).
### Getting Started
1. Clone the repository from the GitHub link: Writer's Haven Express Server.
2. Install the required dependencies using npm or yarn: `npm install`
3. Set up your MongoDB database and add your database URI in a .env file. 
                               ```MONGODB_URI=your-mongodb-uri```
                                ```SECRET_KEY=your-secret-key```  
4. Optionally, configure Nodemailer (currently commented in the code) for email services if you plan to enable email verification during user registration.
5. The backend server will be running at http://localhost:5000 by default.
## API Endpoints
The following are the available API endpoints for interacting with the backend:
- `POST /users`: User registration.
- `POST /users/login`: User login.
- `GET /users/profile`: Fetch user profile.
- `GET /users`: Fetch all users (admin-only route).
- `GET /users/:id`: Fetch a single user by ID (admin-only route).
- `PATCH /users/:id`: Update a user by ID.
- `DELETE /users/:id`: Delete a user by ID.
- `POST /post`: Create a new post.
- `GET /post`: Fetch all posts.
- `GET /post/ownpost`: Fetch posts created by the authenticated user.
- `PATCH /post/:postId`: Update a post by ID.
- `DELETE /post/:postId`: Delete a post by ID.

## Contributors
This project was developed by Tariq Monowar Hossain as part of MERN stack Project.

## Contact
For any queries or suggestions, feel free to contact us at email: `seamhosain360@gmail.com`  We appreciate your interest in Writer's Haven!
