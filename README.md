# ProTask: _A Modern MERN Stack Kanban Board_
ProTask is a clean, intuitive, and full-stack Kanban-style project management application. It provides a seamless drag-and-drop interface to manage tasks through different stages of a workflow.

### Live Demo: https://protaskboard.vercel.app

## ✨ _Features_
1. Full CRUD Functionality: Create, read, update, and delete tasks effortlessly.

2. Intuitive Drag & Drop: Move tasks between columns (To Do, In Progress, Done) to update their status.

3. Sleek & Modern UI: A beautiful, responsive, dark-themed interface built with Tailwind CSS for a great user experience on any device.

4. Non-intrusive Modals: Smooth, animated modals for adding and editing tasks without leaving the main view.

5. Robust RESTful API: A well-structured backend API built with Node.js, Express, and Mongoose, following best practices.

6. Optimistic UI Updates: The UI updates instantly for a fast user experience, with backend synchronization.

## 🛠️ _Tech Stack_
This project leverages a modern and widely-used set of technologies:

* Frontend :     React (UI Library), Tailwind CSS (Styling)

* Backend  :     Node.js (Runtime), Express (Web Framework)

* Database :      MongoDB (NoSQL Database) with Mongoose (ODM)

* Deployment:    Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

## 🚀 _Getting Started: Local Development_
To get a local copy up and running, please follow these simple steps.

  Prerequisites
    Node.js (v16 or later)

  - Git

  - MongoDB Community Server installed and running locally.

### Installation & Setup
  1. Clone the Repository

         git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
         cd your-repo-name

  2. Setup the Backend Server

     * #### Navigate to the backend directory
            cd backend
  
     * ### Install dependencies
            npm install
  
     * ### Create a .env file in the 'backend' folder and add the following lines:
            MONGO_URI=mongodb://localhost:27017/protask
            PORT=5001
       
     * ### Start the backend server (in this terminal)
            npm start

3. Setup the Frontend Application

      * ### Open a new terminal and navigate to the frontend directory
            cd frontend
      
      * ### Install dependencies
            npm install
      
      * ### Start the React development server (in the new terminal)
            npm start
    
  > [!NOTE]
  > Your browser should automatically open to http://localhost:3000.

## 🤝 _How to Contribute_
  Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
  
  If you have a suggestion that would make this better, please fork the repo and create a pull request.

  * Fork the Project
   -Click the 'Fork' button in the top right corner of this repository.
  
  * Create your Feature Branch
    * ```git checkout -b feature/AmazingFeature```
  
  * Commit your Changes
  
    * ```git commit -m 'feat: Add some AmazingFeature```
  
  * Push to the Branch
  
    * ```git push origin feature/AmazingFeature```
  
   * Open a Pull Request
   * Go to the "Pull Requests" tab in your forked repository and open a new pull request to the original repository.

## 📄 _License_
* Distributed under the MIT License. See LICENSE for more information.
