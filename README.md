
Here's the updated README file content with a separate section for Joi validation:

Admin Panel API
This project is a backend API built with Node.js, Express, and PostgreSQL, designed to support an Admin Panel with user management, role-based access control, and project management features. The API allows Admins to create and assign users, manage projects, and keep track of important actions via audit logs.

Objective
The goal of this project is to implement a backend system where:

Admins can manage users and projects.
Managers can assign employees to projects.
Employees can view their assigned projects.
The API implements authentication and authorization, ensuring that users have appropriate access based on their roles.

Task Requirements
User Authentication:

User login, signup, and JWT token-based authentication.
User Role Management:

Admins can create users and assign them roles (Admin, Manager, or Employee).
Project Management:

Admins can create, update, and soft delete projects.
Managers can assign employees to the projects assigned to them.
Audit Logs:

Records key actions such as creating, updating, or deleting resources.
Validation with Joi
Joi is used for data validation to ensure that all inputs are correctly formatted and meet the application's requirements:

User Schema Validation: Ensures all user data (such as username, email, password, and role) is valid and conforms to the expected formats and constraints.
Project Schema Validation: Ensures all project-related data is valid and prevents incomplete or incorrect data entry.
Role Validation: Ensures that only predefined roles ('Admin', 'Manager', 'Employee') are assigned to users.
