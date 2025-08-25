# Job Portal

## Overview
The **Job Portal** is a full-stack MERN application that allows companies to post and manage job listings while enabling users to apply for suitable job opportunities. The platform features authentication, job searching, and category-wise filtering, all within a modern, fully responsive UI.

## Features
- **Company Dashboard**: Employers can log in, post job listings, manage applications, and edit job details.
- **User Authentication**: 
  - **Normal Users**: Authentication via **Clerk Auth** for login and signup.
  - **Companies**: Authentication via **JWT Auth**.
- **Job Application Management**:
  - Users can apply for jobs by uploading resumes stored in **Cloudinary**.
  - Companies can **accept or reject** job applications after reviewing resumes.
  - Companies can view the **list of applied users** for their job postings.
  - Companies can make their **posted jobs invisible** if required.
- **Search & Filter**: Powerful search functionality, including **category-wise filtering**.
- **Error Monitoring**: Integrated **Sentry** for error tracking.
- **Responsive UI/UX**: Fully responsive and modern design, optimized with **Tailwind CSS**.
- **Backend**: Built with **Node.js, Express, and MongoDB**.
- **Frontend**: Developed using **React and Tailwind CSS**.
- **Deployment**: Hosted on **Vercel** (frontend) and **Node.js backend**.

## Tech Stack
### Frontend:
- React.js
- Tailwind CSS (for styling and full responsiveness)
- Clerk Auth (for user authentication)

### Backend:
- Node.js
- Express.js
- MongoDB
- Cloudinary (for file storage)
- Sentry (for error monitoring)
- JWT Auth (for company authentication)

### Deployment:
- **Frontend**: Vercel
- **Backend**: Node.js with Express and MongoDB

## Installation & Setup
### Prerequisites:
- Node.js installed
- MongoDB database setup
- Cloudinary account configured
- Clerk Auth credentials
- JWT Auth setup for company login

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/RishavK1/Job-Portal.git
   cd job-portal
   ```
2. Install dependencies for both frontend and backend:
   ```sh
   cd client
   npm install
   cd ../server
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `server` directory and add:
     ```env
     MONGO_URI=your_mongodb_connection_string
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     CLERK_SECRET_KEY=your_clerk_secret_key
     JWT_SECRET=your_jwt_secret_key
     ```
4. Start the backend server:
   ```sh
   cd server
   npm run server
   ```
5. Start the frontend:
   ```sh
   cd client
   npm run dev
   ```
6. Open the application in your browser at `http://localhost:3000`.

## Project Directory Structure

### Frontend:
```
client/  # Frontend React application
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── eslint.config.js
├── index.html
```

### Backend:
```
server/  # Backend Node.js application
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
├── vercel.json
```


## Contributing
Contributions are welcome! Feel free to fork this repository and create pull requests.

## License
This project is licensed under the MIT License.

## Contact
For queries or support, feel free to reach out via [sanjanayadav@gmail.com] or visit the GitHub repository.


